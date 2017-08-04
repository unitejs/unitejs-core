import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteApplicationFramework } from "../configuration/models/unite/uniteApplicationFramework";
import { UniteBundler } from "../configuration/models/unite/uniteBundler";
import { UniteCssPostProcessor } from "../configuration/models/unite/uniteCssPostProcessor";
import { UniteCssPreProcessor } from "../configuration/models/unite/uniteCssPreProcessor";
import { UniteE2eTestFramework } from "../configuration/models/unite/uniteE2eTestFramework";
import { UniteE2eTestRunner } from "../configuration/models/unite/uniteE2eTestRunner";
import { UniteLinter } from "../configuration/models/unite/uniteLinter";
import { UniteModuleType } from "../configuration/models/unite/uniteModuleType";
import { UnitePackageManager } from "../configuration/models/unite/unitePackageManager";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { UniteUnitTestFramework } from "../configuration/models/unite/uniteUnitTestFramework";
import { UniteUnitTestRunner } from "../configuration/models/unite/uniteUnitTestRunner";
import { BuildConfigurationOperation } from "../interfaces/buildConfigurationOperation";
import { IEngine } from "../interfaces/IEngine";
import { ModuleOperation } from "../interfaces/moduleOperation";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    private _fileSystem;
    private _coreRoot;
    private _assetsFolder;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem);
    configure(packageName: string | undefined | null, title: string | undefined | null, license: string | undefined | null, sourceLanguage: UniteSourceLanguage | undefined | null, moduleType: UniteModuleType | undefined | null, bundler: UniteBundler | undefined | null, unitTestRunner: UniteUnitTestRunner | undefined | null, unitTestFramework: UniteUnitTestFramework | undefined | null, e2eTestRunner: UniteE2eTestRunner | undefined | null, e2eTestFramework: UniteE2eTestFramework | undefined | null, linter: UniteLinter | undefined | null, cssPre: UniteCssPreProcessor | undefined | null, cssPost: UniteCssPostProcessor | undefined | null, packageManager: UnitePackageManager | undefined | null, applicationFramework: UniteApplicationFramework | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    clientPackage(operation: ModuleOperation | undefined | null, packageName: string | undefined | null, version: string | undefined | null, preload: boolean, includeMode: IncludeMode | undefined | null, main: string | undefined | null, mainMinified: string | undefined | null, isPackage: boolean, wrapAssets: string | undefined | null, packageManager: UnitePackageManager | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    buildConfiguration(operation: BuildConfigurationOperation | undefined | null, configurationName: string | undefined | null, bundle: boolean, minify: boolean, sourcemaps: boolean, outputDirectory: string | undefined | null): Promise<number>;
    private cleanupOutputDirectory(outputDirectory);
    private loadConfiguration(outputDirectory);
    private configureRun(outputDirectory, uniteConfiguration, license);
    private clientPackageAdd(packageName, version, preload, includeMode, main, mainMinified, isPackage, wrapAssets, outputDirectory, uniteConfiguration);
    private clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
    private buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration);
    private buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration);
    private createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
    private runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
}
