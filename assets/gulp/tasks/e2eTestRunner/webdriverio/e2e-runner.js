/**
 * Gulp tasks for webdriverio e2e testing.
 */
const display = require("./util/display");
const gulp = require("gulp");
const uc = require("./util/unite-config");
const exec = require("./util/exec");
const path = require("path");
const util = require("util");
const webdriver = require("gulp-webdriver");
const selenium = require("selenium-standalone");
const browserSync = require("browser-sync");
const asyncUtil = require("./util/async-util");

let seleniumInstance = null;
let browserSyncInstance = null;

gulp.task("e2e-run-test", async () => {
    display.info("Running", "WebdriverIO");

    const uniteConfig = await uc.getUniteConfig();
    let hasError = false;

    try {
        await asyncUtil.stream(
            gulp.src("wdio.conf.js")
                .pipe(webdriver()));
    } catch (err) {
        hasError = true;
        display.error("Executing WebdriverIO", err);
    }

    try {
        seleniumInstance.kill();
    } catch (err) {
        // Ignore
    }
    try {
        browserSyncInstance.exit();
    } catch (err) {
        // Ignore
    }

    if (hasError) {
        process.exit(1);
    } else {
        display.info("Running", "Allure Report Generation");

        try {
            await exec.npmRun("allure", [
                "generate",
                path.join(uniteConfig.directories.reports, "/e2etemp/"),
                "-o",
                path.join(uniteConfig.directories.reports, "/e2e/")
            ]);
        } catch (err) {
            display.error("Executing Allure", err);
            process.exit(1);
        }
    }
});

gulp.task("e2e-serve", async () => {
    display.info("Running", "BrowserSync");

    browserSyncInstance = browserSync.create();

    const initAsync = util.promisify(browserSyncInstance.init);
    await initAsync({
        "https": false,
        "notify": false,
        "online": true,
        "open": false,
        "port": 9000,
        "server": {"baseDir": ["."]}
    });

    display.info("Running", "Selenium");
    try {
        seleniumInstance = await util.promisify(selenium.start)();
    } catch (err) {
        display.error("Starting selenium", err);
        process.exit(1);
    }
});

/* Generated by UniteJS */
