/**
 * Gulp tasks for building css.
 */
import * as gulp from "gulp";
import * as less from "gulp-less";
import * as sourcemaps from "gulp-sourcemaps";
import * as path from "path";
import * as through2 from "through2";
import * as asyncUtil from "../../util/async-util";
import * as display from "../../util/display";
import * as errorUtil from "../../util/error-util";
import * as uc from "../../util/unite-config";

gulp.task("build-css-app", async () => {
    display.info("Running", "LESS for App");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);

    let errorCount = 0;

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.cssSrc, `main.${uniteConfig.styleExtension}`))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : through2.obj())
        .pipe(less())
        .on("error", (err) => {
            display.error(err.message);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write() : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.cssDist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});

// Generated by UniteJS
