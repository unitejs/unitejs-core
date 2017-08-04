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
const packageConfiguration_1 = require("../../configuration/models/packages/packageConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existingPackageJson;
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwFolder, PackageJson.FILENAME);
                    if (exists) {
                        _super("log").call(this, logger, display, `Loading existing ${PackageJson.FILENAME}`, { core: engineVariables.wwwFolder, dependenciesFile: PackageJson.FILENAME });
                        existingPackageJson = yield fileSystem.fileReadJson(engineVariables.wwwFolder, PackageJson.FILENAME);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Loading existing ${PackageJson.FILENAME} failed`, err, { core: engineVariables.wwwFolder, dependenciesFile: PackageJson.FILENAME });
                    return 1;
                }
                _super("log").call(this, logger, display, `Generating ${PackageJson.FILENAME} in`, { wwwFolder: engineVariables.wwwFolder });
                const packageJson = existingPackageJson || new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.packageName;
                packageJson.version = packageJson.version || "0.0.1";
                packageJson.license = uniteConfiguration.license;
                packageJson.devDependencies = packageJson.devDependencies || {};
                packageJson.dependencies = packageJson.dependencies || {};
                packageJson.engines = { node: ">=8.0.0" };
                engineVariables.buildDependencies(uniteConfiguration, packageJson.dependencies);
                engineVariables.buildDevDependencies(packageJson.devDependencies);
                packageJson.dependencies = this.sortDependencies(packageJson.dependencies);
                packageJson.devDependencies = this.sortDependencies(packageJson.devDependencies);
                yield fileSystem.fileWriteJson(engineVariables.wwwFolder, PackageJson.FILENAME, packageJson);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Generating ${PackageJson.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        });
    }
    sortDependencies(dependencies) {
        const newDependencies = {};
        const keys = Object.keys(dependencies);
        keys.sort();
        keys.forEach(key => {
            newDependencies[key] = dependencies[key];
        });
        return newDependencies;
    }
}
PackageJson.FILENAME = "package.json";
exports.PackageJson = PackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLG1HQUFnRztBQUVoRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELElBQUksbUJBQXFELENBQUM7Z0JBQzFELElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRTVGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFFcEosbUJBQW1CLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUF1QixlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0gsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLFdBQVcsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQ2xLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLFdBQVcsQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBRTlHLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztnQkFDdEUsV0FBVyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xELFdBQVcsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ3JELFdBQVcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxXQUFXLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO2dCQUNoRSxXQUFXLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO2dCQUMxRCxXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO2dCQUUxQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRixlQUFlLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUVsRSxXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNFLFdBQVcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFakYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDN0YsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsV0FBVyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ3pILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sZ0JBQWdCLENBQUMsWUFBc0M7UUFDM0QsTUFBTSxlQUFlLEdBQTZCLEVBQUUsQ0FBQztRQUNyRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztZQUNaLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZUFBZSxDQUFDO0lBRTNCLENBQUM7O0FBcERjLG9CQUFRLEdBQVcsY0FBYyxDQUFDO0FBRHJELGtDQXNEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
