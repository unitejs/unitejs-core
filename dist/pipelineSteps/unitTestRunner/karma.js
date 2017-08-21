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
 * Pipeline step to generate karma configuration.
 */
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                this.configDefaults(fileSystem, engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma",
                "karma-chrome-launcher",
                "karma-phantomjs-launcher",
                "karma-story-reporter",
                "karma-html-reporter",
                "karma-coverage",
                "karma-coverage-allsources",
                "karma-sourcemap-loader",
                "karma-remap-istanbul",
                "remap-istanbul",
                "bluebird"
            ], uniteConfiguration.unitTestRunner === "Karma");
            if (uniteConfiguration.unitTestRunner === "Karma") {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
                    logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    const lines = [];
                    this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                    yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);
                }
                else {
                    logger.info(`Skipping ${Karma.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
            }
        });
    }
    configDefaults(fileSystem, engineVariables) {
        const defaultConfiguration = new karmaConfiguration_1.KarmaConfiguration();
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        defaultConfiguration.basePath = "__dirname";
        defaultConfiguration.singleRun = true;
        defaultConfiguration.frameworks = [];
        defaultConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        defaultConfiguration.browsers = ["PhantomJS"];
        defaultConfiguration.coverageReporter = {
            include: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(app-module-config|entryPoint).js"))),
            exclude: "",
            reporters: [
                {
                    type: "json",
                    dir: reportsFolder,
                    subdir: "."
                }
            ]
        };
        defaultConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };
        defaultConfiguration.remapIstanbulReporter = {
            reports: {
                text: "",
                json: `${reportsFolder}/coverage.json`,
                html: `${reportsFolder}/coverage`,
                lcovonly: `${reportsFolder}/lcov.info`
            }
        };
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));
        defaultConfiguration.preprocessors = {};
        defaultConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        defaultConfiguration.files = [];
        defaultConfiguration.files.push({
            pattern: srcInclude,
            included: false
        });
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Karma", this._configuration);
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        this._configuration.files.push({ pattern: "../unite.json", included: false });
        // Bluebird should only be necessary while we are using PhantomJS
        const bbInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));
        this._configuration.files.push({ pattern: bbInclude, included: true });
        const testPackages = engineVariables.getTestClientPackages();
        Object.keys(testPackages).forEach(key => {
            if (testPackages[key].main) {
                const mainSplit = testPackages[key].main.split("/");
                const main = mainSplit.pop();
                let location = mainSplit.join("/");
                if (testPackages[key].isPackage) {
                    const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                    this._configuration.files.push({ pattern: keyInclude, included: false });
                }
                else {
                    location += location.length > 0 ? "/" : "";
                    const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                    this._configuration.files.push({ pattern: keyInclude, included: false });
                }
            }
            if (testPackages[key].assets !== undefined && testPackages[key].assets !== null && testPackages[key].assets.length > 0) {
                const cas = testPackages[key].assets.split(",");
                cas.forEach((ca) => {
                    const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${ca}`)));
                    this._configuration.files.push({ pattern: keyInclude, included: false });
                });
            }
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });
        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUN2RSw4RUFBMkU7QUFHM0UsNEZBQXlGO0FBRXpGLGdGQUE2RTtBQUc3RSxXQUFtQixTQUFRLCtDQUFzQjtJQUtoQyxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBRXRJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU87Z0JBQ3hDLHVCQUF1QjtnQkFDdkIsMEJBQTBCO2dCQUMxQixzQkFBc0I7Z0JBQ3RCLHFCQUFxQjtnQkFDckIsZ0JBQWdCO2dCQUNoQiwyQkFBMkI7Z0JBQzNCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLFVBQVU7YUFDYixFQUNtQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxDQUFDLENBQUM7WUFFbkYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXpILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixLQUFLLGNBQWMsSUFBSSxrQkFBa0IsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUUxRixNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7b0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUUsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLFFBQVEsZ0NBQWdDLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztnQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckcsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxVQUF1QixFQUFFLGVBQWdDO1FBQzVFLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBRXRELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBRTFJLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFDNUMsb0JBQW9CLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QyxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLG9CQUFvQixDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDOUcsb0JBQW9CLENBQUMsUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsb0JBQW9CLENBQUMsZ0JBQWdCLEdBQUc7WUFDcEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDLENBQUM7WUFDMUwsT0FBTyxFQUFFLEVBQUU7WUFDWCxTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLGFBQWE7b0JBQ2xCLE1BQU0sRUFBRSxHQUFHO2lCQUNkO2FBQ0o7U0FDSixDQUFDO1FBRUYsb0JBQW9CLENBQUMsWUFBWSxHQUFHO1lBQ2hDLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxNQUFNO1NBQ3JCLENBQUM7UUFFRixvQkFBb0IsQ0FBQyxxQkFBcUIsR0FBRztZQUN6QyxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEdBQUcsYUFBYSxnQkFBZ0I7Z0JBQ3RDLElBQUksRUFBRSxHQUFHLGFBQWEsV0FBVztnQkFDakMsUUFBUSxFQUFFLEdBQUcsYUFBYSxZQUFZO2FBQ3pDO1NBQ0osQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0ssb0JBQW9CLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFM0Usb0JBQW9CLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFFBQVEsRUFBRSxLQUFLO1NBQ2xCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBGLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLEtBQWU7UUFDckksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5RSxpRUFBaUU7UUFDakUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FDbEMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5SixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXZFLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTdELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDakMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzdCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRW5DLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUNuQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsR0FBRyxJQUFJLFFBQVEscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BLLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQzdFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQzNDLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQ25DLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxHQUFHLElBQUksUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4SixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JILE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTtvQkFDWCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUNuQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMzQixPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1lBQ3JMLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMzQixPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ2pMLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMzQixPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN6SyxRQUFRLEVBQUUsS0FBSztTQUNsQixDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsdUJBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBOUpjLGNBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsc0JBZ0tDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RSdW5uZXIva2FybWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUga2FybWEgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgS2FybWFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2thcm1hL2thcm1hQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEthcm1hIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwia2FybWEuY29uZi5qc1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogS2FybWFDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hXCIsXG4gICAgICAgICAgICBcImthcm1hLWNocm9tZS1sYXVuY2hlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1waGFudG9tanMtbGF1bmNoZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtc3RvcnktcmVwb3J0ZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtaHRtbC1yZXBvcnRlclwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZVwiLFxuICAgICAgICAgICAgXCJrYXJtYS1jb3ZlcmFnZS1hbGxzb3VyY2VzXCIsXG4gICAgICAgICAgICBcImthcm1hLXNvdXJjZW1hcC1sb2FkZXJcIixcbiAgICAgICAgICAgIFwia2FybWEtcmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwicmVtYXAtaXN0YW5idWxcIixcbiAgICAgICAgICAgIFwiYmx1ZWJpcmRcIlxuICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtLYXJtYS5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsaW5lcyk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUsIGxpbmVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7S2FybWEuRklMRU5BTUV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgS2FybWFDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVBhdGggPSBcIl9fZGlybmFtZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zaW5nbGVSdW4gPSB0cnVlO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5mcmFtZXdvcmtzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlcG9ydGVycyA9IFtcInN0b3J5XCIsIFwiY292ZXJhZ2UtYWxsc291cmNlc1wiLCBcImNvdmVyYWdlXCIsIFwiaHRtbFwiLCBcImthcm1hLXJlbWFwLWlzdGFuYnVsXCJdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5icm93c2VycyA9IFtcIlBoYW50b21KU1wiXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY292ZXJhZ2VSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovIShhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpLFxuICAgICAgICAgICAgZXhjbHVkZTogXCJcIixcbiAgICAgICAgICAgIHJlcG9ydGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgc3ViZGlyOiBcIi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5odG1sUmVwb3J0ZXIgPSB7XG4gICAgICAgICAgICBvdXRwdXREaXI6IHJlcG9ydHNGb2xkZXIsXG4gICAgICAgICAgICByZXBvcnROYW1lOiBcInVuaXRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnJlbWFwSXN0YW5idWxSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgICAgICAgIGpzb246IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlLmpzb25gLFxuICAgICAgICAgICAgICAgIGh0bWw6IGAke3JlcG9ydHNGb2xkZXJ9L2NvdmVyYWdlYCxcbiAgICAgICAgICAgICAgICBsY292b25seTogYCR7cmVwb3J0c0ZvbGRlcn0vbGNvdi5pbmZvYFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNyY0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovISgqLWJ1bmRsZXxhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlcHJvY2Vzc29yc1tzcmNJbmNsdWRlXSA9IFtcInNvdXJjZW1hcFwiLCBcImNvdmVyYWdlXCJdO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmZpbGVzID0gW107XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBwYXR0ZXJuOiBzcmNJbmNsdWRlLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiS2FybWFcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUNvbmZpZyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBsaW5lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjogXCIuLi91bml0ZS5qc29uXCIsIGluY2x1ZGVkOiBmYWxzZSB9KTtcblxuICAgICAgICAvLyBCbHVlYmlyZCBzaG91bGQgb25seSBiZSBuZWNlc3Nhcnkgd2hpbGUgd2UgYXJlIHVzaW5nIFBoYW50b21KU1xuICAgICAgICBjb25zdCBiYkluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIFwiYmx1ZWJpcmQvanMvYnJvd3Nlci9ibHVlYmlyZC5qc1wiKSkpO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goeyBwYXR0ZXJuOiBiYkluY2x1ZGUsIGluY2x1ZGVkOiB0cnVlIH0pO1xuXG4gICAgICAgIGNvbnN0IHRlc3RQYWNrYWdlcyA9IGVuZ2luZVZhcmlhYmxlcy5nZXRUZXN0Q2xpZW50UGFja2FnZXMoKTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0ZXN0UGFja2FnZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXN0UGFja2FnZXNba2V5XS5tYWluKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFpblNwbGl0ID0gdGVzdFBhY2thZ2VzW2tleV0ubWFpbi5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFpbiA9IG1haW5TcGxpdC5wb3AoKTtcbiAgICAgICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBtYWluU3BsaXQuam9pbihcIi9cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodGVzdFBhY2thZ2VzW2tleV0uaXNQYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtsb2NhdGlvbn0vKiovKi57anMsaHRtbCxjc3N9YCkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9IGxvY2F0aW9uLmxlbmd0aCA+IDAgPyBcIi9cIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtsb2NhdGlvbn0ke21haW59YCkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5maWxlcy5wdXNoKHsgcGF0dGVybjoga2V5SW5jbHVkZSwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRlc3RQYWNrYWdlc1trZXldLmFzc2V0cyAhPT0gdW5kZWZpbmVkICYmIHRlc3RQYWNrYWdlc1trZXldLmFzc2V0cyAhPT0gbnVsbCAmJiB0ZXN0UGFja2FnZXNba2V5XS5hc3NldHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcyA9IHRlc3RQYWNrYWdlc1trZXldLmFzc2V0cy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgY2FzLmZvckVhY2goKGNhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIGAke2tleX0vJHtjYX1gKSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goeyBwYXR0ZXJuOiBrZXlJbmNsdWRlLCBpbmNsdWRlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBwYXR0ZXJuOiBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdERpc3RGb2xkZXIsIFwiLi4vdW5pdC1tb2R1bGUtY29uZmlnLmpzXCIpKSksXG4gICAgICAgICAgICBpbmNsdWRlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIi4uL3VuaXQtYm9vdHN0cmFwLmpzXCIpKSksXG4gICAgICAgICAgICBpbmNsdWRlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmZpbGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmVzLnB1c2goXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZykge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgICAgIGNvbmZpZy5zZXQoJHtKc29uSGVscGVyLmNvZGlmeSh0aGlzLl9jb25maWd1cmF0aW9uKX0pO2ApO1xuICAgICAgICBsaW5lcy5wdXNoKFwifTtcIik7XG4gICAgICAgIGxpbmVzLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIi8qIFwiLCBcIiAqL1wiKSk7XG4gICAgfVxufVxuIl19
