/**
 * Pipeline step to generate WebdriverIO configuration.
 */
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class WebdriverIo extends EnginePipelineStepBase {
    private static FILENAME: string = "wdio.conf.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webdriverio",
                                             "wdio-spec-reporter",
                                             "wdio-allure-reporter",
                                             "browser-sync",
                                             "selenium-standalone",
                                             "allure-commandline"],
                                            uniteConfiguration.e2eTestRunner === "WebdriverIO");

        engineVariables.toggleDevDependency(["wdio-jasmine-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Jasmine");
        engineVariables.toggleDevDependency(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
        engineVariables.toggleDevDependency(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint");

        engineVariables.lintPlugins.webdriverio = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";
        engineVariables.lintEnv["webdriverio/wdio"] = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";

        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, WebdriverIo.FILENAME);

                if (hasGeneratedMarker) {
                    logger.info(`Generating ${WebdriverIo.FILENAME}`);

                    const lines: string[] = [];
                    this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                    await fileSystem.fileWriteLines(engineVariables.wwwFolder, WebdriverIo.FILENAME, lines);
                } else {
                    logger.info(`Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${WebdriverIo.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwFolder, WebdriverIo.FILENAME);
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, engineVariables.reportsFolder));

        const webdriverConfiguration = new WebdriverIoConfiguration();
        webdriverConfiguration.baseUrl = "http://localhost:9000";
        webdriverConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, fileSystem.pathCombine(engineVariables.e2eTestDistFolder, "**/*.spec.js")))
        ];
        webdriverConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        webdriverConfiguration.sync = false;

        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            webdriverConfiguration.framework = "jasmine";
        } else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            webdriverConfiguration.framework = "mocha";
        }
        webdriverConfiguration.reporters = ["spec", "allure"];
        webdriverConfiguration.reporterOptions = {
            allure: {
                outputDir: `${reportsFolder}/e2etemp/`
            }
        };

        const e2eBootstrap = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, fileSystem.pathCombine(engineVariables.e2eTestFolder, "e2e-bootstrap.js")));

        lines.push(`exports.config = ${JsonHelper.codify(webdriverConfiguration)}`);
        lines.push(`exports.config.before = require('${e2eBootstrap}');`);
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
