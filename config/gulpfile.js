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
			.src("../stuff/scss/*.scss")
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
			.src("../stuff/script/*.js")
			.pipe(terser())
			.pipe(gulp.dest("../public/script/"))
			.pipe(browserSync.reload());
	})
);

gulp.task(
	"pug",
	gulp.series(function () {
		return gulp
			.src("../stuff/pug/pages/*.pug")
			.pipe(pug())
			.pipe(gulp.dest("../public/pages/"))
			.pipe(browserSync.reload());
	})
);

gulp.task(
	"watch",
	gulp.series(function () {
		gulp.watch("../stuff/scss/**/*.scss", gulp.series("sass"));
		gulp.watch("../stuff/script/**/*.js", gulp.series("js"));
		gulp.watch("../stuff/pug/**/*.pug", gulp.series("pug"));
	})
);

gulp.task("default", gulp.parallel("server", "watch"));
