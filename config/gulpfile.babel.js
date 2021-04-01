import { task, series, src, dest, watch, parallel } from "gulp";
import sass, { logError } from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import pug from "gulp-pug";
import babel from "gulp-babel";
import terser from "gulp-terser";

const browserSync = require("browser-sync").create();

task(
	"server",
	series(function () {
		browserSync.init({
			server: {
				baseDir: "../",
				index: "public/pages/index.html",
			},
		});
	})
);

task(
	"sass",
	series(function () {
		return src("../src/scss/*.scss")
			.pipe(sass().on("error", logError))
			.pipe(autoprefixer(["last 15 versions"]))
			.pipe(cleanCSS())
			.pipe(dest("../public/css"))
			.pipe(browserSync.stream());
	})
);

task(
	"js",
	series(function () {
		return src("../src/script/*.js")
			.pipe(babel({ presets: ["@babel/env"] }))
			.pipe(terser())
			.pipe(dest("../public/script/"));
	})
);

task(
	"pug",
	series(function () {
		return src("../src/pug/pages/*.pug")
			.pipe(pug())
			.pipe(dest("../public/pages/"));
	})
);

task(
	"watch",
	series(function () {
		watch("../src/scss/**/*.scss", series("sass"));
		watch("../src/script/**/*.js", series("js")).on("change", () => {
			browserSync.reload;
		});
		watch("../src/pug/**/*.pug", series("pug")).on("change", () => {
			browserSync.reload;
		});
	})
);

task("default", parallel("server", "watch"));
