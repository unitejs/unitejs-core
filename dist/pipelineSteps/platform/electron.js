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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Electron extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.objectCondition(uniteConfiguration.platforms, Electron.PLATFORM);
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["archiver",
                "electron-packager",
                "unitejs-image-cli"], mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp"));
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderCreate").call(this, logger, fileSystem, engineVariables.platformRootFolder);
            if (ret === 0) {
                const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");
                const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.build, "/assets/platform/electron/");
                if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp")) {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                    ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME, engineVariables.force, false, { "\\\"../util/": ["\"./util/"] });
                    const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/electron/");
                    if (ret === 0) {
                        ret = yield this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME_MAIN_DEV, buildAssetPlatform, Electron.FILENAME_MAIN_DEV, engineVariables.force, false);
                    }
                    if (ret === 0) {
                        ret = yield this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME_MAIN_PROD, buildAssetPlatform, Electron.FILENAME_MAIN_PROD, engineVariables.force, false);
                    }
                }
                else {
                    ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildTasks, Electron.FILENAME, engineVariables.force);
                    if (ret === 0) {
                        ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildAssetPlatform, Electron.FILENAME_MAIN_DEV, engineVariables.force);
                    }
                    if (ret === 0) {
                        ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildAssetPlatform, Electron.FILENAME_MAIN_PROD, engineVariables.force);
                    }
                }
            }
            return ret;
        });
    }
}
Electron.PLATFORM = "Electron";
Electron.FILENAME = "platform-electron.js";
Electron.FILENAME_MAIN_DEV = "main-dev.js";
Electron.FILENAME_MAIN_PROD = "main.js";
exports.Electron = Electron;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2VsZWN0cm9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsY0FBc0IsU0FBUSxtQ0FBZ0I7SUFNbkMsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDN0osZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVTtnQkFDWCxtQkFBbUI7Z0JBQ25CLG1CQUFtQixDQUFDLEVBQ3BCLGFBQWEsSUFBSSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRTlHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUUzRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUNoRixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFFM0csRUFBRSxDQUFDLENBQUMsYUFBYSxJQUFJLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO29CQUNuSCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFDdEgsRUFBRSxjQUFjLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRTdELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGdDQUFnQyxDQUFDLENBQUM7b0JBQ25ILEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMzSyxDQUFDO29CQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM3SyxDQUFDO2dCQUVMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osR0FBRyxHQUFHLE1BQU0sd0JBQW9CLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLHdCQUFvQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDaEksQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsTUFBTSx3QkFBb0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pJLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBOztBQWxEYyxpQkFBUSxHQUFXLFVBQVUsQ0FBQztBQUM5QixpQkFBUSxHQUFXLHNCQUFzQixDQUFDO0FBQzFDLDBCQUFpQixHQUFXLGFBQWEsQ0FBQztBQUMxQywyQkFBa0IsR0FBVyxTQUFTLENBQUM7QUFKMUQsNEJBb0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgZWxlY3Ryb24gcGxhdGZvcm0gY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgRWxlY3Ryb24gZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBQTEFURk9STTogc3RyaW5nID0gXCJFbGVjdHJvblwiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInBsYXRmb3JtLWVsZWN0cm9uLmpzXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUVfTUFJTl9ERVY6IHN0cmluZyA9IFwibWFpbi1kZXYuanNcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9NQUlOX1BST0Q6IHN0cmluZyA9IFwibWFpbi5qc1wiO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKSA6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIub2JqZWN0Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMsIEVsZWN0cm9uLlBMQVRGT1JNKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImFyY2hpdmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZWxlY3Ryb24tcGFja2FnZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0ZWpzLWltYWdlLWNsaVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnBsYXRmb3JtUm9vdEZvbGRlcik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRUYXNrcyA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5idWlsZCwgXCIvdGFza3MvXCIpO1xuICAgICAgICAgICAgY29uc3QgYnVpbGRBc3NldFBsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkLCBcIi9hc3NldHMvcGxhdGZvcm0vZWxlY3Ryb24vXCIpO1xuXG4gICAgICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFRhc2tzUGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC9kaXN0L3Rhc2tzL3BsYXRmb3JtL1wiKTtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYXNzZXRUYXNrc1BsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRSwgYnVpbGRUYXNrcywgRWxlY3Ryb24uRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFwiXFxcXFxcXCIuLi91dGlsL1wiOiBbXCJcXFwiLi91dGlsL1wiXSB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0UGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC9hc3NldHMvcGxhdGZvcm0vZWxlY3Ryb24vXCIpO1xuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0UGxhdGZvcm0sIEVsZWN0cm9uLkZJTEVOQU1FX01BSU5fREVWLCBidWlsZEFzc2V0UGxhdGZvcm0sIEVsZWN0cm9uLkZJTEVOQU1FX01BSU5fREVWLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFBsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRV9NQUlOX1BST0QsIGJ1aWxkQXNzZXRQbGF0Zm9ybSwgRWxlY3Ryb24uRklMRU5BTUVfTUFJTl9QUk9ELCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZURlbGV0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBidWlsZFRhc2tzLCBFbGVjdHJvbi5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVEZWxldGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRBc3NldFBsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRV9NQUlOX0RFViwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkQXNzZXRQbGF0Zm9ybSwgRWxlY3Ryb24uRklMRU5BTUVfTUFJTl9QUk9ELCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
