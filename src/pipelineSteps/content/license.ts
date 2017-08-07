/**
 * Pipeline step to generate LICENSE.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class License extends EnginePipelineStepBase {
    private static FILENAME: string = "LICENSE";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${License.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder});

            await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, License.FILENAME, engineVariables.license.licenseText.split("\n"));

            return 0;
        } catch (err) {
            logger.error(`Generating ${License.FILENAME} failed`, err);
            return 1;
        }
    }
}
