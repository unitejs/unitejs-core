/**
 * Gulp tasks for post building css.
 */
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const path = require("path");
const through2 = require("through2");
const asyncUtil = require("../../util/async-util");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("build-css-post-components", async () => {
    display.info("Running", "CSS None for Components");
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);
    await asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.dist, "**/*.css"))
        .pipe(buildConfiguration.minify ? cssnano() : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
    if (buildConfiguration.minify) {
        await asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.dist, "**/*.css"))
            .pipe(cssnano())
            .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
    }
});
// Generated by UniteJS
