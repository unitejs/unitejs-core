/**
 * Gulp tasks for wrapping Browserify modules.
 */
const browserify = require("browserify");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const path = require("path");
const through2 = require("through2");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const asyncUtil = require("../../util/async-util");
const clientPackages = require("../../util/client-packages");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);
    if (buildConfiguration.bundle) {
        display.info("Running", "Browserify for App");
        const bApp = browserify({
            debug: buildConfiguration.sourcemaps,
            entries: `./${path.join(uniteConfig.dirs.www.dist, "entryPoint.js")}`
        });
        const vendorPackages = await clientPackages.getBundleVendorPackages(uniteConfig);
        let hasStyleLoader = false;
        Object.keys(vendorPackages).forEach((key) => {
            bApp.exclude(key);
            const idx = key.indexOf("systemjs");
            if (idx >= 0) {
                hasStyleLoader = key === "systemjs-plugin-css";
            }
        });
        bApp.transform("envify", {
            NODE_ENV: buildConfiguration.minify ? "production" : "development",
            global: true
        });
        bApp.transform("browserify-css", {
            autoInject: hasStyleLoader
        });
        bApp.transform("stringify", {
            appliesTo: {
                includeExtensions: uniteConfig.viewExtensions.map(ext => `.${ext}`)
            }
        });
        return asyncUtil.stream(bApp.bundle().on("error", (err) => {
                display.error(err);
            })
            .pipe(source("app-bundle.js"))
            .pipe(buffer())
            .pipe(buildConfiguration.minify ? uglify()
                .on("error", (err) => {
                    display.error(err.toString());
                }) : through2.obj())
            .pipe(buildConfiguration.sourcemaps ? sourcemaps.init({
                loadMaps: true
            }) : through2.obj())
            .pipe(buildConfiguration.sourcemaps ?
                sourcemaps.mapSources((sourcePath) => sourcePath.replace(/dist\//, "./")) : through2.obj())
            .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
                includeContent: true
            }) : through2.obj())
            .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
    }
});
// Generated by UniteJS
