const browserSync = require("browser-sync").create(),
	gulp = require("gulp"),
	sass = require("gulp-sass"),
	cleanCSS = require("gulp-clean-css"),
	autoprefixer = require("gulp-autoprefixer"),
	terser = require("gulp-terser"),
	pug = require("gulp-pug");

gulp.task(
	"server",
	gulp.series(function () {
		browserSync.init({
			server: {
				baseDir: "../",
				index: "public/pages/index.html",
			},
		});
	})
);

gulp.task(
	"sass",
	gulp.series(function () {
		return gulp
			.src("../src/scss/*.scss")
			.pipe(sass().on("error", sass.logError))
			.pipe(autoprefixer(["last 15 versions"]))
			.pipe(cleanCSS())
			.pipe(gulp.dest("../public/css"))
			.pipe(browserSync.stream());
	})
);

gulp.task(
	"js",
	gulp.series(function () {
		return gulp
			.src("../src/script/*.js")
			.pipe(terser())
			.pipe(gulp.dest("../public/script/"));
	})
);

gulp.task(
	"pug",
	gulp.series(function () {
		return gulp
			.src("../src/pug/pages/*.pug")
			.pipe(pug())
			.pipe(gulp.dest("../public/pages/"));
	})
);

gulp.task(
	"watch",
	gulp.series(function () {
		gulp.watch("../src/scss/**/*.scss", gulp.series("sass"));
		gulp.watch("../src/script/**/*.js", gulp.series("js")).on(
			"change",
			browserSync.reload
		);
		gulp.watch("../src/pug/**/*.pug", gulp.series("pug")).on(
			"change",
			browserSync.reload
		);
	})
);

gulp.task("default", gulp.parallel("server", "watch"));
