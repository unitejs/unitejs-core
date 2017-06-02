/**
 * Main engine
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { UniteUnitTestFramework } from "../configuration/models/unite/uniteUnitTestFramework";
import { UniteUnitTestRunner } from "../configuration/models/unite/uniteUnitTestRunner";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { AppScaffold } from "../pipelineSteps/appScaffold";
import { Babel } from "../pipelineSteps/babel";
import { Chai } from "../pipelineSteps/chai";
import { GulpBuild } from "../pipelineSteps/gulpBuild";
import { GulpScaffold } from "../pipelineSteps/gulpScaffold";
import { GulpTasksBuild } from "../pipelineSteps/gulpTasksBuild";
import { GulpTasksUnit } from "../pipelineSteps/gulpTasksUnit";
import { GulpTasksUtil } from "../pipelineSteps/gulpTasksUtil";
import { HtmlTemplate } from "../pipelineSteps/htmlTemplate";
import { Mocha } from "../pipelineSteps/mocha";
import { ModuleLoader } from "../pipelineSteps/moduleLoader";
import { OutputDirectory } from "../pipelineSteps/outputDirectory";
import { PackageJson } from "../pipelineSteps/packageJson";
import { TypeScript } from "../pipelineSteps/typeScript";
import { UniteConfigurationJson } from "../pipelineSteps/uniteConfigurationJson";
import { UnitTestScaffold } from "../pipelineSteps/unitTestScaffold";
import { EngineValidation } from "./engineValidation";
import { EngineVariables } from "./engineVariables";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;
    private _fileSystem: IFileSystem;

    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }

    public async init(packageName: string | undefined | null,
                      title: string | undefined | null,
                      sourceLanguage: UniteSourceLanguage | undefined | null,
                      moduleLoader: UniteModuleLoader | undefined | null,
                      unitTestRunner: UniteUnitTestRunner | undefined | null,
                      unitTestFramework: UniteUnitTestFramework | undefined | null,
                      sourceMaps: boolean,
                      outputDirectory: string | undefined | null): Promise<number> {
        if (!EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
            return 1;
        }
        if (!EngineValidation.notEmpty(this._display, "title", title)) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteSourceLanguage>(this._display, "sourceLanguage", sourceLanguage, [ "JavaScript", "TypeScript"])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteModuleLoader>(this._display, "moduleLoader", moduleLoader, [ "RequireJS", "Webpack", "Browserify", "JSPM"])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteUnitTestRunner>(this._display, "unitTestRunner", unitTestRunner, [ "None", "Mocha", "Karma" ])) {
            return 1;
        }
        if (!EngineValidation.checkOneOf<UniteUnitTestFramework>(this._display, "unitTestFramework", unitTestFramework, [ "Chai", "Jasmine" ])) {
            return 1;
        }
        outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory!);
        if (!EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
            return 1;
        }

        this._logger.info("Engine::init", { packageName, sourceLanguage, moduleLoader, outputDirectory });

        const uniteConfiguration = new UniteConfiguration();
        uniteConfiguration.packageName = packageName!;
        uniteConfiguration.title = title!;
        uniteConfiguration.sourceLanguage = sourceLanguage!;
        uniteConfiguration.moduleLoader = moduleLoader!;
        uniteConfiguration.sourceMaps = sourceMaps;
        uniteConfiguration.unitTestRunner = unitTestRunner!;
        uniteConfiguration.unitTestFramework = unitTestFramework!;
        uniteConfiguration.outputDirectory = outputDirectory;
        uniteConfiguration.staticClientModules = [];

        const engineVariables: EngineVariables = new EngineVariables();
        engineVariables.requiredDependencies = [];
        engineVariables.requiredDevDependencies = [];
        engineVariables.assetsDirectory = "./node_modules/unitejs-core/dist/assets/";
        engineVariables.dependenciesFile = "unite-dependencies.json";
        engineVariables.sourceLanguageExt = uniteConfiguration.sourceLanguage === "JavaScript" ? "js" : "ts";

        const pipelineSteps: IEnginePipelineStep[] = [];
        pipelineSteps.push(new OutputDirectory());
        pipelineSteps.push(new AppScaffold());
        pipelineSteps.push(new GulpScaffold());
        pipelineSteps.push(new UnitTestScaffold());
        pipelineSteps.push(new GulpBuild());
        pipelineSteps.push(new GulpTasksBuild());
        pipelineSteps.push(new GulpTasksUtil());
        pipelineSteps.push(new GulpTasksUnit());
        pipelineSteps.push(new ModuleLoader());
        pipelineSteps.push(new HtmlTemplate());
        pipelineSteps.push(new Babel());
        pipelineSteps.push(new TypeScript());
        pipelineSteps.push(new Mocha());
        pipelineSteps.push(new Chai());
        pipelineSteps.push(new UniteConfigurationJson());
        pipelineSteps.push(new PackageJson());

        for (const pipelineStep of pipelineSteps) {
            const ret = await pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    public async module(operation: ModuleOperation | undefined | null,
                        name: string | undefined | null): Promise<number> {
        if (!EngineValidation.checkOneOf<ModuleOperation>(this._display, "operation", operation, [ "add" ])) {
            return 1;
        }
        if (!EngineValidation.notEmpty(this._display, "name", name)) {
            return 1;
        }

        return 0;
    }
}