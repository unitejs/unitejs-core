/**
 * Gulp tasks for bundling SystemJS modules.
 */
const gulp = require("gulp");
const insert = require("gulp-insert");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const fs = require("fs");
const gutil = require("gulp-util");
const uc = require("./util/unite-config");
const moduleConfig = require("./util/module-config");
const display = require("./util/display");
const Builder = require("systemjs-builder");
const uglify = require("gulp-uglify");

function addBootstrap (uniteConfig, buildConfiguration, cb) {
    let bootstrap = moduleConfig.create(uniteConfig, ["app", "both"], true);
    bootstrap += "Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))";
    bootstrap += ".then(function() {";
    bootstrap += "SystemJS.import('dist/entryPoint');";
    bootstrap += "});";

    const bootstrapFile = path.join(uniteConfig.directories.dist, "app-bundle-bootstrap.js");
    fs.writeFile(path.join(uniteConfig.directories.dist, "app-bundle-bootstrap.js"), bootstrap, (err) => {
        if (err) {
            display.error(err);
            process.exit(1);
        } else {
            gulp.src(bootstrapFile)
                .pipe(buildConfiguration.minify ? uglify() : gutil.noop())
                .pipe(gulp.dest(uniteConfig.directories.dist))
                .on("end", () => {
                    fs.readFile(bootstrapFile, (err2, bootstrap2) => {
                        if (err2) {
                            display.error(err2);
                            process.exit(1);
                        } else {
                            gulp.src(path.join(uniteConfig.directories.dist, "app-bundle.js"))
                                .pipe(buildConfiguration.sourcemaps
                                    ? sourcemaps.init({"loadMaps": true}) : gutil.noop())
                                .pipe(insert.append(bootstrap2))
                                .pipe(buildConfiguration.sourcemaps
                                    ? sourcemaps.write({"includeContent": true}) : gutil.noop())
                                .pipe(gulp.dest(uniteConfig.directories.dist))
                                .on("end", cb);
                        }
                    });
                });
        }
    });
}

gulp.task("build-bundle-app", (cb) => {
    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration();

    if (buildConfiguration.bundle) {
        display.info("Running", "Systemjs builder for App");

        const builder = new Builder("./", `${uniteConfig.directories.dist}app-module-config.js`);

        const dist = uniteConfig.directories.dist;

        const packageFiles = [
            `${dist}**/*.js`,
            ` + ${dist}**/*.html!text`,
            ` + ${dist}**/*.css!text`,
            ` - ${dist}vendor-bundle.js`,
            ` - ${dist}vendor-bundle-init.js`,
            ` - ${dist}app-module-config.js`
        ];

        builder.bundle(packageFiles.join(""), path.join(uniteConfig.directories.dist, "app-bundle.js"),
            {
                "minify": buildConfiguration.minify,
                "sourceMaps": buildConfiguration.sourcemaps ? "inline" : false
            })
            .then(() => {
                addBootstrap(uniteConfig, buildConfiguration, cb);
            })
            .catch((err) => {
                display.error(err);
                process.exit(1);
            });
    } else {
        cb();
    }
});

/* Generated by UniteJS */
