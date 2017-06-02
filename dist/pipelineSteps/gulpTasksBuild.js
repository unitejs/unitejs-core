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
const stringHelper_1 = require("../core/stringHelper");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpTasksBuild extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                const assetTasks = fileSystem.directoryPathCombine(engineVariables.assetsDirectory, "gulp/tasks/" + stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/");
                engineVariables.requiredDevDependencies.push("del");
                if (uniteConfiguration.sourceMaps) {
                    engineVariables.requiredDevDependencies.push("gulp-sourcemaps");
                }
                if (uniteConfiguration.sourceLanguage === "JavaScript") {
                    engineVariables.requiredDevDependencies.push("gulp-babel");
                }
                else if (uniteConfiguration.sourceLanguage === "TypeScript") {
                    engineVariables.requiredDevDependencies.push("gulp-typescript");
                    engineVariables.requiredDevDependencies.push("typescript");
                }
                yield this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        });
    }
}
exports.GulpTasksBuild = GulpTasksBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzQnVpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLHVEQUFvRDtBQUNwRCw2RUFBMEU7QUFNMUUsb0JBQTRCLFNBQVEsK0NBQXNCO0lBQ3pDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFFdkgsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsYUFBYSxHQUFHLDJCQUFZLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN2SyxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVwRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BFLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3JELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ2hFLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7Z0JBRUQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFFdEgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHdDQUF3QyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2xJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUEzQkQsd0NBMkJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzQnVpbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
