/**
 * Gulp tasks for wrapping Browserify modules.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");
const clientPackages = require("./util/client-packages");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");

gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.bundle) {
        display.info("Running", "Browserify for App");

        const bApp = browserify({
            "debug": buildConfiguration.sourcemaps,
            "entries": `./${path.join(uniteConfig.dirs.www.dist, "entryPoint.js")}`
        });

        const keys = clientPackages.getKeys(uniteConfig, ["app", "both"]);

        keys.forEach((key) => {
            bApp.exclude(key);
        });

        if (buildConfiguration.minify) {
            process.env.NODE_ENV = "production";
        }

        return asyncUtil.stream(bApp.bundle()
            .pipe(source("app-bundle.js"))
            .pipe(buffer())
            .pipe(buildConfiguration.minify ? uglify()
                .on("error", (err) => {
                    display.error(err.toString());
                }) : gutil.noop())
            .pipe(buildConfiguration.sourcemaps ? sourcemaps.init({"loadMaps": true}) : gutil.noop())
            .pipe(buildConfiguration.sourcemaps
                ? sourcemaps.mapSources((sourcePath) => sourcePath.replace(/dist\//, "./")) : gutil.noop())
            .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({"includeContent": true}) : gutil.noop())
            .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
    }
});

/* Generated by UniteJS */
