/**
 * Pipeline step to generate jasmine configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Jasmine extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["jasmine-core"], uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");
        engineVariables.toggleDevDependency(["@types/jasmine"],
                                            (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine")
                                            && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.lintEnv.jasmine = uniteConfiguration.linter === "ESLint" && (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");

        if (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine") {
            try {
                logger.info("Generating Jasmine Configuration");

                return 0;
            } catch (err) {
                logger.error("Generating Jasmine Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}
