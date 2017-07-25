/**
 * Gulp tasks for building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const stylus = require("gulp-stylus");
const uc = require("./util/unite-config");
const gutil = require("gulp-util");

gulp.task("build-css-components", () => {
    display.info("Running", "Stylus for Components");

    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration();

    return gulp.src(path.join(uniteConfig.directories.src, "**/*.styl"))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(stylus())
        .on("error", (err) => {
            display.error(err.message);
            process.exit(1);
        })
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.dist));
});

/* Generated by UniteJS */
