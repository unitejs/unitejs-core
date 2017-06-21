/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { UniteDirectories } from "./uniteDirectories";
import { UniteLinter } from "./uniteLinter";
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UnitePackageManager } from "./unitePackageManager";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";

export class UniteConfiguration {
    public packageName: string;
    public title: string;
    public license: string;
    public sourceLanguage: UniteSourceLanguage;
    public moduleLoader: UniteModuleLoader;
    public linter: UniteLinter;
    public packageManager: UnitePackageManager;
    public unitTestRunner: UniteUnitTestRunner;
    public unitTestFramework: UniteUnitTestFramework;

    public staticClientModules: string[];

    public clientPackages: { [id: string]: { version: string, preload: boolean, main: string, includeMode: IncludeMode } };

    public directories: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;
}