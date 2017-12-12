"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Package Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const unitePackageClientConfiguration_1 = require("../configuration/models/unitePackages/unitePackageClientConfiguration");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
const pipelineKey_1 = require("../engine/pipelineKey");
const packageHelper_1 = require("../helpers/packageHelper");
const templateHelper_1 = require("../helpers/templateHelper");
const clientPackageCommand_1 = require("./clientPackageCommand");
class PackageCommand extends engineCommandBase_1.EngineCommandBase {
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, undefined, undefined, false);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("packageManager", uniteConfiguration.packageManager)))) {
                return 1;
            }
            if (!(yield this._pipeline.tryLoad(uniteConfiguration, new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType)))) {
                return 1;
            }
            return this.packageAdd(args, uniteConfiguration);
        });
    }
    packageAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
                return 1;
            }
            this._logger.info("");
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            try {
                const rootPackageFolder = yield packageHelper_1.PackageHelper.locate(this._fileSystem, this._logger, engineVariables.engineRootFolder, "unitejs-packages");
                let ret = 0;
                if (rootPackageFolder) {
                    const packageFolder = this._fileSystem.pathCombine(rootPackageFolder, `assets/${args.packageName}`);
                    const packageDirExists = yield this._fileSystem.directoryExists(packageFolder);
                    if (packageDirExists) {
                        const packageFileExists = yield this._fileSystem.fileExists(packageFolder, "unite-package.json");
                        if (packageFileExists) {
                            const unitePackageConfiguration = yield this._fileSystem.fileReadJson(packageFolder, "unite-package.json");
                            const moduleType = this._pipeline.getStep(new pipelineKey_1.PipelineKey("moduleType", uniteConfiguration.moduleType));
                            yield moduleType.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                            ret = yield this.processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration);
                        }
                        else {
                            ret = 1;
                            this._logger.error(`Package file '${this._fileSystem.pathCombine(packageFolder, "unite-package.json")}' does not exist`);
                        }
                    }
                    else {
                        ret = 1;
                        this._logger.error(`Package folder '${packageFolder}' does not exist`);
                    }
                }
                else {
                    ret = 1;
                }
                return ret;
            }
            catch (err) {
                this._logger.error(`There was an error loading unite-package.json for package '${args.packageName}'`, err);
                return 1;
            }
        });
    }
    processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            const appFrameworkFolder = this._fileSystem.pathCombine(packageFolder, uniteConfiguration.applicationFramework.toLowerCase());
            const appFrameworkFolderExists = yield this._fileSystem.directoryExists(appFrameworkFolder);
            if (appFrameworkFolderExists) {
                const subFolders = yield this._fileSystem.directoryGetFolders(appFrameworkFolder);
                const codeSubstitutions = templateHelper_1.TemplateHelper.createCodeSubstitutions(engineVariables);
                for (let i = 0; i < subFolders.length && ret === 0; i++) {
                    const actualWwwFolder = engineVariables.www[subFolders[i]];
                    if (actualWwwFolder) {
                        const actualSource = this._fileSystem.pathCombine(appFrameworkFolder, subFolders[i]);
                        this._logger.info("Copying folder", { sourceFolder: actualSource, destFolder: actualWwwFolder });
                        ret = yield this.copyFolder(uniteConfiguration, actualSource, actualWwwFolder, codeSubstitutions);
                    }
                    else {
                        ret = 1;
                        this._logger.error(`There is no destination folder '${subFolders[i]}' to copy content to.`);
                    }
                }
            }
            if (ret === 0) {
                ret = yield this.addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration);
            }
            if (ret === 0) {
                this._pipeline.add("content", "packageJson");
                this._pipeline.add("unite", "uniteConfigurationJson");
                ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            }
            if (ret === 0) {
                ret = yield this.addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration);
            }
            if (ret === 0) {
                this.displayCompletionMessage(engineVariables, true);
            }
            return ret;
        });
    }
    copyFolder(uniteConfiguration, sourceFolder, destFolder, substitutions) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            try {
                const destFolderExists = yield this._fileSystem.directoryExists(destFolder);
                if (!destFolderExists) {
                    yield this._fileSystem.directoryCreate(destFolder);
                }
            }
            catch (err) {
                this._logger.error(`There was an creating folder '${destFolder}'`, err);
                ret = 1;
            }
            if (ret === 0) {
                const usableExtensions = uniteConfiguration.sourceExtensions
                    .concat(uniteConfiguration.viewExtensions)
                    .concat(uniteConfiguration.styleExtension);
                const files = yield this._fileSystem.directoryGetFiles(sourceFolder);
                for (let i = 0; i < files.length && ret === 0; i++) {
                    try {
                        const ext = /\.(.*)$/.exec(files[i]);
                        if (ext && ext.length > 1 && usableExtensions.indexOf(ext[1]) >= 0) {
                            this._logger.info("Copying file", { sourceFolder, destFolder, file: files[i] });
                            let data = yield this._fileSystem.fileReadText(sourceFolder, files[i]);
                            data = templateHelper_1.TemplateHelper.replaceSubstitutions(substitutions, data);
                            yield this._fileSystem.fileWriteText(destFolder, files[i], data);
                        }
                    }
                    catch (err) {
                        this._logger.error(`There was an error copying file '${files[i]}'`, err);
                        ret = 1;
                    }
                }
            }
            if (ret === 0) {
                const folders = yield this._fileSystem.directoryGetFolders(sourceFolder);
                for (let i = 0; i < folders.length && ret === 0; i++) {
                    ret = yield this.copyFolder(uniteConfiguration, this._fileSystem.pathCombine(sourceFolder, folders[i]), this._fileSystem.pathCombine(destFolder, folders[i]), substitutions);
                }
            }
            return ret;
        });
    }
    addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            if (unitePackageConfiguration.routes && Object.keys(unitePackageConfiguration.routes).length > 0) {
                const appFramework = this._pipeline.getStep(new pipelineKey_1.PipelineKey("applicationFramework", uniteConfiguration.applicationFramework));
                ret = yield appFramework.insertRoutes(this._logger, this._fileSystem, uniteConfiguration, engineVariables, unitePackageConfiguration.routes);
            }
            return ret;
        });
    }
    addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = 0;
            if (unitePackageConfiguration.clientPackages) {
                const keys = Object.keys(unitePackageConfiguration.clientPackages);
                for (let i = 0; i < keys.length && ret === 0; i++) {
                    const clientPackage = unitePackageConfiguration.clientPackages[keys[i]];
                    if (this.matchesConditions(this._logger, uniteConfiguration, clientPackage.conditions)) {
                        let finalClientPackage = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
                        if (clientPackage.profile) {
                            const profilePackage = yield this.loadProfile("unitejs-packages", "assets", "clientPackage.json", clientPackage.profile);
                            if (profilePackage === null) {
                                ret = 1;
                            }
                            else {
                                delete clientPackage.profile;
                                finalClientPackage = Object.assign({}, finalClientPackage, profilePackage);
                            }
                        }
                        if (ret === 0) {
                            finalClientPackage = Object.assign({}, finalClientPackage, clientPackage);
                            ret = yield clientPackageCommand_1.ClientPackageCommand.retrievePackageDetails(this._logger, this._fileSystem, engineVariables, finalClientPackage);
                            if (ret === 0) {
                                if (finalClientPackage.isDevDependency) {
                                    engineVariables.addVersionedDevDependency(finalClientPackage.name, finalClientPackage.version);
                                }
                                else {
                                    uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
                                    uniteConfiguration.clientPackages[finalClientPackage.name] = finalClientPackage;
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        });
    }
    matchesConditions(logger, uniteConfiguration, conditions) {
        if (conditions && conditions.length > 0) {
            for (let i = 0; i < conditions.length; i++) {
                if (conditions[i].property !== undefined) {
                    if (conditions[i].value !== undefined) {
                        let matches = this.propertyMatches(uniteConfiguration, conditions[i].property, conditions[i].value);
                        if (conditions[i].not) {
                            matches = !matches;
                        }
                        if (!matches) {
                            return false;
                        }
                    }
                    else {
                        logger.error(`Can not match condition when value is not set`);
                        return null;
                    }
                }
                else {
                    logger.error(`Can not match condition when property is not set`);
                    return null;
                }
            }
            return true;
        }
        else {
            return true;
        }
    }
    propertyMatches(uniteConfigurationObject, property, value) {
        const propertyLower = property.toLowerCase();
        const actualProperty = Object.keys(uniteConfigurationObject).find(key => key.toLowerCase() === propertyLower);
        if (actualProperty) {
            const configValue = uniteConfigurationObject[actualProperty];
            if (configValue) {
                return configValue.toLowerCase() === value.toLowerCase();
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
exports.PackageCommand = PackageCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wYWNrYWdlQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFJekYsMkhBQXdIO0FBR3hILG1FQUFnRTtBQUNoRSwrREFBNEQ7QUFDNUQsdURBQW9EO0FBQ3BELDREQUF5RDtBQUN6RCw4REFBMkQ7QUFLM0QsaUVBQThEO0FBRTlELG9CQUE0QixTQUFRLHFDQUFpQjtJQUNwQyxHQUFHLENBQUMsSUFBMkI7O1lBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTNHLEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLElBQUkseUJBQVcsQ0FBQyxzQkFBc0IsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsRUFBRSxDQUFDLENB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QUFDLElBQUksQ0FBQztvQkFDaEIsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztvQkFDakUsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFFTyxlQUFlLENBQUMsd0JBQTZCLEVBQUUsUUFBZ0IsRUFBRSxLQUFhO1FBQ2xGLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUU3QyxNQUFNLGNBQWMsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDO1FBRXRILEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFN0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBOVJELHdDQThSQyIsImZpbGUiOiJjb21tYW5kcy9wYWNrYWdlQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGFja2FnZSBDb21tYW5kXG4gKi9cbmltcG9ydCB7IFBhcmFtZXRlclZhbGlkYXRpb24gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL3BhcmFtZXRlclZhbGlkYXRpb25cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVQYWNrYWdlcy91bml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZVBhY2thZ2VDb25kaXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVQYWNrYWdlcy91bml0ZVBhY2thZ2VDb25kaXRpb25cIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVQYWNrYWdlcy91bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVDb21tYW5kQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBhY2thZ2VIZWxwZXIgfSBmcm9tIFwiLi4vaGVscGVycy9wYWNrYWdlSGVscGVyXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3RlbXBsYXRlSGVscGVyXCI7XG5pbXBvcnQgeyBJQXBwbGljYXRpb25GcmFtZXdvcmsgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQXBwbGljYXRpb25GcmFtZXdvcmtcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcbmltcG9ydCB7IElQYWNrYWdlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IENsaWVudFBhY2thZ2VDb21tYW5kIH0gZnJvbSBcIi4vY2xpZW50UGFja2FnZUNvbW1hbmRcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VDb21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJUGFja2FnZUNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElQYWNrYWdlQ29tbWFuZFBhcmFtcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHVuaXRlQ29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMubG9hZENvbmZpZ3VyYXRpb24oYXJncy5vdXRwdXREaXJlY3RvcnksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIlRoZXJlIGlzIG5vIHVuaXRlLmpzb24gdG8gY29uZmlndXJlLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwiYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwicGFja2FnZU1hbmFnZXJcIiwgdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9waXBlbGluZS50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgbmV3IFBpcGVsaW5lS2V5KFwibW9kdWxlVHlwZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnBhY2thZ2VBZGQoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHBhY2thZ2VBZGQoYXJnczogSVBhY2thZ2VDb21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwicGFja2FnZU5hbWVcIiwgYXJncy5wYWNrYWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByb290UGFja2FnZUZvbGRlciA9IGF3YWl0IFBhY2thZ2VIZWxwZXIubG9jYXRlKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2xvZ2dlciwgZW5naW5lVmFyaWFibGVzLmVuZ2luZVJvb3RGb2xkZXIsIFwidW5pdGVqcy1wYWNrYWdlc1wiKTtcblxuICAgICAgICAgICAgbGV0IHJldCA9IDA7XG4gICAgICAgICAgICBpZiAocm9vdFBhY2thZ2VGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShyb290UGFja2FnZUZvbGRlciwgYGFzc2V0cy8ke2FyZ3MucGFja2FnZU5hbWV9YCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlRGlyRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMocGFja2FnZUZvbGRlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFja2FnZURpckV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlRmlsZUV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhwYWNrYWdlRm9sZGVyLCBcInVuaXRlLXBhY2thZ2UuanNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGFja2FnZUZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZVBhY2thZ2VDb25maWd1cmF0aW9uPihwYWNrYWdlRm9sZGVyLCBcInVuaXRlLXBhY2thZ2UuanNvblwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlVHlwZSA9IHRoaXMuX3BpcGVsaW5lLmdldFN0ZXA8SVBpcGVsaW5lU3RlcD4obmV3IFBpcGVsaW5lS2V5KFwibW9kdWxlVHlwZVwiLCB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBtb2R1bGVUeXBlLmluaXRpYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMucHJvY2Vzc1BhY2thZ2UodW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIHBhY2thZ2VGb2xkZXIsIHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGFja2FnZSBmaWxlICcke3RoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocGFja2FnZUZvbGRlciwgXCJ1bml0ZS1wYWNrYWdlLmpzb25cIil9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQYWNrYWdlIGZvbGRlciAnJHtwYWNrYWdlRm9sZGVyfScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBUaGVyZSB3YXMgYW4gZXJyb3IgbG9hZGluZyB1bml0ZS1wYWNrYWdlLmpzb24gZm9yIHBhY2thZ2UgJyR7YXJncy5wYWNrYWdlTmFtZX0nYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzUGFja2FnZSh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZUZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbjogVW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSAwO1xuXG4gICAgICAgIGNvbnN0IGFwcEZyYW1ld29ya0ZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocGFja2FnZUZvbGRlciwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgIGNvbnN0IGFwcEZyYW1ld29ya0ZvbGRlckV4aXN0cyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGFwcEZyYW1ld29ya0ZvbGRlcik7XG5cbiAgICAgICAgaWYgKGFwcEZyYW1ld29ya0ZvbGRlckV4aXN0cykge1xuICAgICAgICAgICAgY29uc3Qgc3ViRm9sZGVycyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0Rm9sZGVycyhhcHBGcmFtZXdvcmtGb2xkZXIpO1xuXG4gICAgICAgICAgICBjb25zdCBjb2RlU3Vic3RpdHV0aW9ucyA9IFRlbXBsYXRlSGVscGVyLmNyZWF0ZUNvZGVTdWJzdGl0dXRpb25zKGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViRm9sZGVycy5sZW5ndGggJiYgcmV0ID09PSAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxXd3dGb2xkZXIgPSBlbmdpbmVWYXJpYWJsZXMud3d3W3N1YkZvbGRlcnNbaV1dO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWxXd3dGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsU291cmNlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShhcHBGcmFtZXdvcmtGb2xkZXIsIHN1YkZvbGRlcnNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiQ29weWluZyBmb2xkZXJcIiwgeyBzb3VyY2VGb2xkZXI6IGFjdHVhbFNvdXJjZSwgZGVzdEZvbGRlcjogYWN0dWFsV3d3Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY29weUZvbGRlcih1bml0ZUNvbmZpZ3VyYXRpb24sIGFjdHVhbFNvdXJjZSwgYWN0dWFsV3d3Rm9sZGVyLCBjb2RlU3Vic3RpdHV0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBUaGVyZSBpcyBubyBkZXN0aW5hdGlvbiBmb2xkZXIgJyR7c3ViRm9sZGVyc1tpXX0nIHRvIGNvcHkgY29udGVudCB0by5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmFkZFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuYWRkUm91dGUodW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Q29tcGxldGlvbk1lc3NhZ2UoZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjb3B5Rm9sZGVyKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzdGl0dXRpb25zOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIHwgc3RyaW5nW10gfSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSAwO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkZXN0Rm9sZGVyRXhpc3RzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMoZGVzdEZvbGRlcik7XG4gICAgICAgICAgICBpZiAoIWRlc3RGb2xkZXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShkZXN0Rm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFRoZXJlIHdhcyBhbiBjcmVhdGluZyBmb2xkZXIgJyR7ZGVzdEZvbGRlcn0nYCwgZXJyKTtcbiAgICAgICAgICAgIHJldCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB1c2FibGVFeHRlbnNpb25zID0gdW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUV4dGVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHVuaXRlQ29uZmlndXJhdGlvbi52aWV3RXh0ZW5zaW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHVuaXRlQ29uZmlndXJhdGlvbi5zdHlsZUV4dGVuc2lvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhzb3VyY2VGb2xkZXIpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aCAmJiByZXQgPT09IDA7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4dCA9IC9cXC4oLiopJC8uZXhlYyhmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4dCAmJiBleHQubGVuZ3RoID4gMSAmJiB1c2FibGVFeHRlbnNpb25zLmluZGV4T2YoZXh0WzFdKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkNvcHlpbmcgZmlsZVwiLCB7IHNvdXJjZUZvbGRlciwgZGVzdEZvbGRlciwgZmlsZTogZmlsZXNbaV0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRUZXh0KHNvdXJjZUZvbGRlciwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gVGVtcGxhdGVIZWxwZXIucmVwbGFjZVN1YnN0aXR1dGlvbnMoc3Vic3RpdHV0aW9ucywgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChkZXN0Rm9sZGVyLCBmaWxlc1tpXSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBUaGVyZSB3YXMgYW4gZXJyb3IgY29weWluZyBmaWxlICcke2ZpbGVzW2ldfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlcnMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmRpcmVjdG9yeUdldEZvbGRlcnMoc291cmNlRm9sZGVyKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9sZGVycy5sZW5ndGggJiYgcmV0ID09PSAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmNvcHlGb2xkZXIodW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHNvdXJjZUZvbGRlciwgZm9sZGVyc1tpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZGVzdEZvbGRlciwgZm9sZGVyc1tpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0aXR1dGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFkZFJvdXRlKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uOiBVbml0ZVBhY2thZ2VDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBsZXQgcmV0ID0gMDtcblxuICAgICAgICBpZiAodW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbi5yb3V0ZXMgJiYgT2JqZWN0LmtleXModW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbi5yb3V0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFwcEZyYW1ld29yayA9IHRoaXMuX3BpcGVsaW5lLmdldFN0ZXA8SUFwcGxpY2F0aW9uRnJhbWV3b3JrPihuZXcgUGlwZWxpbmVLZXkoXCJhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmspKTtcblxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgYXBwRnJhbWV3b3JrLmluc2VydFJvdXRlcyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uLnJvdXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkUGFja2FnZXModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb246IFVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuXG4gICAgICAgIGxldCByZXQgPSAwO1xuXG4gICAgICAgIGlmICh1bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlcyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoICYmIHJldCA9PT0gMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xpZW50UGFja2FnZSA9IHVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNba2V5c1tpXV07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaGVzQ29uZGl0aW9ucyh0aGlzLl9sb2dnZXIsIHVuaXRlQ29uZmlndXJhdGlvbiwgY2xpZW50UGFja2FnZS5jb25kaXRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmluYWxDbGllbnRQYWNrYWdlOiBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWVudFBhY2thZ2UucHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZVBhY2thZ2UgPSBhd2FpdCB0aGlzLmxvYWRQcm9maWxlPFVuaXRlQ2xpZW50UGFja2FnZT4oXCJ1bml0ZWpzLXBhY2thZ2VzXCIsIFwiYXNzZXRzXCIsIFwiY2xpZW50UGFja2FnZS5qc29uXCIsIGNsaWVudFBhY2thZ2UucHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZmlsZVBhY2thZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2xpZW50UGFja2FnZS5wcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsQ2xpZW50UGFja2FnZSA9IHsuLi5maW5hbENsaWVudFBhY2thZ2UsIC4uLnByb2ZpbGVQYWNrYWdlfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsQ2xpZW50UGFja2FnZSA9IHsuLi5maW5hbENsaWVudFBhY2thZ2UsIC4uLmNsaWVudFBhY2thZ2V9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBDbGllbnRQYWNrYWdlQ29tbWFuZC5yZXRyaWV2ZVBhY2thZ2VEZXRhaWxzKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLCBmaW5hbENsaWVudFBhY2thZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsQ2xpZW50UGFja2FnZS5pc0RldkRlcGVuZGVuY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmFkZFZlcnNpb25lZERldkRlcGVuZGVuY3koZmluYWxDbGllbnRQYWNrYWdlLm5hbWUsIGZpbmFsQ2xpZW50UGFja2FnZS52ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgPSB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXMgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1tmaW5hbENsaWVudFBhY2thZ2UubmFtZV0gPSBmaW5hbENsaWVudFBhY2thZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hdGNoZXNDb25kaXRpb25zKGxvZ2dlcjogSUxvZ2dlciwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGNvbmRpdGlvbnM6IFVuaXRlUGFja2FnZUNvbmRpdGlvbltdKTogYm9vbGVhbiB8IG51bGwge1xuICAgICAgICBpZiAoY29uZGl0aW9ucyAmJiBjb25kaXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25zW2ldLnByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmRpdGlvbnNbaV0udmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSB0aGlzLnByb3BlcnR5TWF0Y2hlcyh1bml0ZUNvbmZpZ3VyYXRpb24sIGNvbmRpdGlvbnNbaV0ucHJvcGVydHksIGNvbmRpdGlvbnNbaV0udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uZGl0aW9uc1tpXS5ub3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gIW1hdGNoZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2FuIG5vdCBtYXRjaCBjb25kaXRpb24gd2hlbiB2YWx1ZSBpcyBub3Qgc2V0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2FuIG5vdCBtYXRjaCBjb25kaXRpb24gd2hlbiBwcm9wZXJ0eSBpcyBub3Qgc2V0YCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJvcGVydHlNYXRjaGVzKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdDogYW55LCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5TG93ZXIgPSBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbFByb3BlcnR5OiBzdHJpbmcgPSBPYmplY3Qua2V5cyh1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QpLmZpbmQoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpID09PSBwcm9wZXJ0eUxvd2VyKTtcblxuICAgICAgICBpZiAoYWN0dWFsUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0W2FjdHVhbFByb3BlcnR5XTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZ1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1ZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
