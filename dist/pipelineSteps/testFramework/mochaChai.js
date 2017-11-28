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
 * Pipeline step to generate mocha configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class MochaChai extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.unitTestFramework, "MochaChai") || super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const isUnit = _super("condition").call(this, uniteConfiguration.unitTestFramework, "MochaChai");
            const isE2E = _super("condition").call(this, uniteConfiguration.e2eTestFramework, "MochaChai");
            engineVariables.toggleDevDependency(["mocha"], mainCondition);
            engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], mainCondition && _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && isUnit);
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);
            engineVariables.toggleDevDependency(["wdio-mocha-framework"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);
            engineVariables.toggleClientPackage("chai", {
                name: "chai",
                main: "chai.js",
                preload: true,
                includeMode: "test"
            }, mainCondition);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, mainCondition);
            }
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", mainCondition && isUnit);
            }
            const protractorConfiguration = engineVariables.getConfiguration("Protractor");
            if (protractorConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(protractorConfiguration, "framework", "mocha", mainCondition && isE2E);
                const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));
                objectHelper_1.ObjectHelper.addRemove(protractorConfiguration, "mochaOpts", {
                    reporter: "mochawesome-screenshots",
                    reporterOptions: {
                        reportDir: `${reportsFolder}/e2e/`,
                        reportName: "index",
                        takePassedScreenshot: true
                    },
                    timeout: 10000
                }, mainCondition && isE2E);
            }
            const webdriverIoConfiguration = engineVariables.getConfiguration("WebdriverIO");
            if (webdriverIoConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(webdriverIoConfiguration, "framework", "mocha", mainCondition && isE2E);
            }
            return 0;
        });
    }
}
exports.MochaChai = MochaChai;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFTM0Usb0VBQWlFO0FBRWpFLGVBQXVCLFNBQVEsbUNBQWdCO0lBQ3BDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25KLENBQUM7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzdKLE1BQU0sTUFBTSxHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDbEYsTUFBTSxLQUFLLEdBQUcsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVoRixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM5RCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLEVBQUUsYUFBYSxJQUFJLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFeEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxFQUFFLGFBQWEsSUFBSSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQztZQUUzSixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLGFBQWEsSUFBSSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUU1SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLGFBQWEsSUFBSSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUUxSixlQUFlLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFO2dCQUNKLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxTQUFTO2dCQUNmLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFdBQVcsRUFBRSxNQUFNO2FBQ3RCLEVBQ0QsYUFBYSxDQUFDLENBQUM7WUFFbkQsTUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXNCLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsMkJBQVksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEYsQ0FBQztZQUVELE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztZQUN6RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBYSxJQUFJLE1BQU0sQ0FBQyxDQUFDO1lBQzNGLENBQUM7WUFFRCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQiwyQkFBWSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQWEsSUFBSSxLQUFLLENBQUMsQ0FBQztnQkFFOUYsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRXBJLDJCQUFZLENBQUMsU0FBUyxDQUFDLHVCQUF1QixFQUFFLFdBQVcsRUFBRTtvQkFDakMsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsZUFBZSxFQUFFO3dCQUNiLFNBQVMsRUFBRSxHQUFHLGFBQWEsT0FBTzt3QkFDbEMsVUFBVSxFQUFFLE9BQU87d0JBQ25CLG9CQUFvQixFQUFFLElBQUk7cUJBQzdCO29CQUNELE9BQU8sRUFBRSxLQUFLO2lCQUNqQixFQUNGLGFBQWEsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBRUQsTUFBTSx3QkFBd0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTJCLGFBQWEsQ0FBQyxDQUFDO1lBQzNHLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztnQkFDM0IsMkJBQVksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFhLElBQUksS0FBSyxDQUFDLENBQUM7WUFDbkcsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQTdERCw4QkE2REMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL21vY2hhQ2hhaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBtb2NoYSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJJby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBNb2NoYUNoYWkgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpIDogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrLCBcIk1vY2hhQ2hhaVwiKSB8fCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmssIFwiTW9jaGFDaGFpXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgaXNVbml0ID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgXCJNb2NoYUNoYWlcIik7XG4gICAgICAgIGNvbnN0IGlzRTJFID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrLCBcIk1vY2hhQ2hhaVwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJtb2NoYVwiXSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIkB0eXBlcy9tb2NoYVwiLCBcIkB0eXBlcy9jaGFpXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWEtbW9jaGFcIiwgXCJrYXJtYS1jaGFpXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikgJiYgaXNVbml0KTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJtb2NoYXdlc29tZS1zY3JlZW5zaG90c1wiXSwgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiUHJvdHJhY3RvclwiKSAmJiBpc0UyRSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wid2Rpby1tb2NoYS1mcmFtZXdvcmtcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIldlYmRyaXZlcklPXCIpICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcImNoYWlcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjaGFpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcImNoYWkuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgY29uc3QgZXNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEVzTGludENvbmZpZ3VyYXRpb24+KFwiRVNMaW50XCIpO1xuICAgICAgICBpZiAoZXNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmVudiwgXCJtb2NoYVwiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGthcm1hQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEthcm1hQ29uZmlndXJhdGlvbj4oXCJLYXJtYVwiKTtcbiAgICAgICAgaWYgKGthcm1hQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGthcm1hQ29uZmlndXJhdGlvbi5mcmFtZXdvcmtzLCBcIm1vY2hhXCIsIG1haW5Db25kaXRpb24gJiYgaXNVbml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3RyYWN0b3JDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248UHJvdHJhY3RvckNvbmZpZ3VyYXRpb24+KFwiUHJvdHJhY3RvclwiKTtcbiAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHByb3RyYWN0b3JDb25maWd1cmF0aW9uLCBcImZyYW1ld29ya1wiLCBcIm1vY2hhXCIsIG1haW5Db25kaXRpb24gJiYgaXNFMkUpO1xuXG4gICAgICAgICAgICBjb25zdCByZXBvcnRzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMud3d3LnJlcG9ydHMpKTtcblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShwcm90cmFjdG9yQ29uZmlndXJhdGlvbiwgXCJtb2NoYU9wdHNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyOiBcIm1vY2hhd2Vzb21lLXNjcmVlbnNob3RzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0ZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydERpcjogYCR7cmVwb3J0c0ZvbGRlcn0vZTJlL2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydE5hbWU6IFwiaW5kZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVBhc3NlZFNjcmVlbnNob3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uICYmIGlzRTJFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbj4oXCJXZWJkcml2ZXJJT1wiKTtcbiAgICAgICAgaWYgKHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh3ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24sIFwiZnJhbWV3b3JrXCIsIFwibW9jaGFcIiwgbWFpbkNvbmRpdGlvbiAmJiBpc0UyRSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
