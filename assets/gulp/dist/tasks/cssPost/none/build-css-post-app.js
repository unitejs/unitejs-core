/**
 * Gulp tasks for post building css.
 */
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const path = require("path");
const through2 = require("through2");
const asyncUtil = require("../../util/async-util");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("build-css-post-app", async () => {
    display.info("Running", "CSS None for App");
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);
    await asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.cssDist, "main.css"))
        .pipe(rename("style.css"))
        .pipe(buildConfiguration.minify ? cssnano() : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.cssDist)));
    if (buildConfiguration.minify) {
        await asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.cssDist, "**/!(style).css"))
            .pipe(cssnano())
            .pipe(gulp.dest(uniteConfig.dirs.www.cssDist)));
    }
});
// Generated by UniteJS
