/**
 * Gulp tasks for building TypeScript.
 */
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");
const uglify = require("gulp-uglify");
const path = require("path");
const through2 = require("through2");
const asyncUtil = require("../../util/async-util");
const display = require("../../util/display");
const errorUtil = require("../../util/error-util");
const uc = require("../../util/unite-config");
/*! {TRANSPILEINCLUDE} */
gulp.task("build-transpile", async () => {
    display.info("Running", "TypeScript");
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, true);
    const tsProject = typescript.createProject("tsconfig.json");
    let errorCount = 0;
    return asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.src, `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : through2.obj())
        .pipe("{TRANSPILEPREBUILD}")
        .pipe(tsProject(typescript.reporter.nullReporter()))
        .on("error", (err) => {
            display.error(err.message);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .js
        .pipe("{TRANSPILEPOSTBUILD}")
        .pipe(buildConfiguration.minify ? uglify()
            .on("error", (err) => {
                display.error(err.toString());
            }) : through2.obj())
        .pipe(buildConfiguration.sourcemaps ?
            sourcemaps.mapSources((sourcePath) => `./src/${sourcePath}`) : through2.obj())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
            includeContent: true,
            sourceRoot: ""
        }) : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.dist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});
// Generated by UniteJS
