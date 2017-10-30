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
 * Pipeline step to generate scaffolding for React application.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const sharedAppFramework_1 = require("../sharedAppFramework");
class React extends sharedAppFramework_1.SharedAppFramework {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.applicationFramework, "React");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "tsx", _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "jsx", _super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-preset-react"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            engineVariables.toggleDevDependency(["eslint-plugin-react"], mainCondition && _super("condition").call(this, uniteConfiguration.linter, "ESLint"));
            engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            engineVariables.toggleDevDependency(["unitejs-react-protractor-plugin"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor"));
            engineVariables.toggleDevDependency(["unitejs-react-webdriver-plugin"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
            engineVariables.toggleClientPackage("react", {
                name: "react",
                main: "umd/react.development.js",
                mainMinified: "umd/react.production.min.js",
                includeMode: "both"
            }, mainCondition);
            engineVariables.toggleClientPackage("react-dom", {
                name: "react-dom",
                main: "umd/react-dom.development.js",
                mainMinified: "umd/react-dom.production.min.js",
                includeMode: "both"
            }, mainCondition);
            engineVariables.toggleClientPackage("react-router-dom", {
                name: "react-router-dom",
                main: "umd/react-router-dom.js",
                mainMinified: "umd/react-router-dom.min.js",
                includeMode: "both"
            }, mainCondition);
            engineVariables.toggleClientPackage("require-css", {
                name: "require-css",
                main: "css.js",
                includeMode: "both",
                map: { css: "require-css" }
            }, mainCondition && _super("condition").call(this, uniteConfiguration.bundler, "RequireJS"));
            engineVariables.toggleClientPackage("systemjs-plugin-css", {
                name: "systemjs-plugin-css",
                main: "css.js",
                includeMode: "both",
                map: { css: "systemjs-plugin-css" },
                loaders: { "*.css": "css" }
            }, mainCondition &&
                (_super("condition").call(this, uniteConfiguration.bundler, "Browserify") ||
                    _super("condition").call(this, uniteConfiguration.bundler, "SystemJSBuilder") ||
                    _super("condition").call(this, uniteConfiguration.bundler, "Webpack")));
            if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp") && _super("condition").call(this, uniteConfiguration.bundler, "RequireJS")) {
                _super("createLoaderTypeMapReplacement").call(this, engineVariables, "css", "css");
            }
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.parserOptions.ecmaFeatures, "jsx", true, mainCondition);
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", mainCondition);
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.plugins, "react", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
            }
            const tsLintConfiguration = engineVariables.getConfiguration("TSLint");
            if (tsLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
            }
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.presets, "react", mainCondition);
            }
            const protractorConfiguration = engineVariables.getConfiguration("Protractor");
            if (protractorConfiguration) {
                const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-react-protractor-plugin")));
                arrayHelper_1.ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
            }
            const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
            if (webdriverIoPlugins) {
                arrayHelper_1.ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-react-webdriver-plugin", mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                const sourceExtension = _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                    `app${sourceExtension}x`,
                    `child/child${sourceExtension}x`,
                    `bootstrapper${sourceExtension}`,
                    `entryPoint${sourceExtension}`
                ]);
                if (ret === 0) {
                    ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`child/child`]);
                }
                if (ret === 0) {
                    ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);
                }
                if (ret === 0) {
                    ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
                }
                if (ret === 0) {
                    ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                }
                return ret;
            }
            else {
                return 0;
            }
        });
    }
}
exports.React = React;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFXM0UsOERBQTJEO0FBRTNELFdBQW1CLFNBQVEsdUNBQWtCO0lBQ2xDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM5SixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUV2RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQzFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxDQUFDO2dCQUV4Rix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQzFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBQzVGLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGFBQWEsSUFBSSxtQkFBZSxZQUFD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LEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9HLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxHQUFHLE1BQU0seUJBQXFCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxXQUFXLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0gsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxXQUFXLGVBQWUsRUFBRSxFQUFFLG9CQUFvQixlQUFlLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM1SyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLEdBQUcsR0FBRyxNQUFNLHFCQUFpQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQzNGLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBMUpELHNCQTBKQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3JlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBSZWFjdCBhcHBsaWNhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3RzbGludC90c0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBKYXZhU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy92c2NvZGUvamF2YVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi4vc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5cbmV4cG9ydCBjbGFzcyBSZWFjdCBleHRlbmRzIFNoYXJlZEFwcEZyYW1ld29yayB7XG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLCBcIlJlYWN0XCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodW5pdGVDb25maWd1cmF0aW9uLnZpZXdFeHRlbnNpb25zLCBcImh0bWxcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlRXh0ZW5zaW9ucywgXCJ0c3hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIlR5cGVTY3JpcHRcIikpO1xuXG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUV4dGVuc2lvbnMsIFwianN4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJKYXZhU2NyaXB0XCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiYmFiZWwtcHJlc2V0LXJlYWN0XCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiSmF2YVNjcmlwdFwiKSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImVzbGludC1wbHVnaW4tcmVhY3RcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5saW50ZXIsIFwiRVNMaW50XCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJAdHlwZXMvcmVhY3RcIiwgXCJAdHlwZXMvcmVhY3QtZG9tXCIsIFwiQHR5cGVzL3JlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJUeXBlU2NyaXB0XCIpKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLXJlYWN0LXByb3RyYWN0b3ItcGx1Z2luXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1yZWFjdC13ZWJkcml2ZXItcGx1Z2luXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJyZWFjdFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInJlYWN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcInVtZC9yZWFjdC5kZXZlbG9wbWVudC5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcInVtZC9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYm90aFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFwicmVhY3QtZG9tXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicmVhY3QtZG9tXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcInVtZC9yZWFjdC1kb20uZGV2ZWxvcG1lbnQuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJ1bWQvcmVhY3QtZG9tLnByb2R1Y3Rpb24ubWluLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJib3RoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJyZWFjdC1yb3V0ZXItZG9tXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicmVhY3Qtcm91dGVyLWRvbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJ1bWQvcmVhY3Qtcm91dGVyLWRvbS5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcInVtZC9yZWFjdC1yb3V0ZXItZG9tLm1pbi5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYm90aFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFwicmVxdWlyZS1jc3NcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJyZXF1aXJlLWNzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJjc3MuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogeyBjc3M6IFwicmVxdWlyZS1jc3NcIiB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIlJlcXVpcmVKU1wiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJzeXN0ZW1qcy1wbHVnaW4tY3NzXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic3lzdGVtanMtcGx1Z2luLWNzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJjc3MuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogeyBjc3M6IFwic3lzdGVtanMtcGx1Z2luLWNzc1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXJzOiB7IFwiKi5jc3NcIiA6IFwiY3NzXCIgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uICYmXG4gICAgICAgICAgICAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIkJyb3dzZXJpZnlcIikgfHxcbiAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJTeXN0ZW1KU0J1aWxkZXJcIikgfHxcbiAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJXZWJwYWNrXCIpKSk7XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJSZXF1aXJlSlNcIikpIHtcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUxvYWRlclR5cGVNYXBSZXBsYWNlbWVudChlbmdpbmVWYXJpYWJsZXMsIFwiY3NzXCIsIFwiY3NzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEVzTGludENvbmZpZ3VyYXRpb24+KFwiRVNMaW50XCIpO1xuICAgICAgICBpZiAoZXNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLnBhcnNlck9wdGlvbnMuZWNtYUZlYXR1cmVzLCBcImpzeFwiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmV4dGVuZHMsIFwicGx1Z2luOnJlYWN0L3JlY29tbWVuZGVkXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24ucGx1Z2lucywgXCJyZWFjdFwiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJuby11bnVzZWQtdmFyc1wiLCAxLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxUc0xpbnRDb25maWd1cmF0aW9uPihcIlRTTGludFwiKTtcbiAgICAgICAgaWYgKHRzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJuby1lbXB0eVwiLCB7IHNldmVyaXR5OiBcIndhcm5pbmdcIiB9LCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJuby1lbXB0eS1pbnRlcmZhY2VcIiwgeyBzZXZlcml0eTogXCJ3YXJuaW5nXCIgfSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHRzTGludENvbmZpZ3VyYXRpb24ucnVsZXMsIFwidmFyaWFibGUtbmFtZVwiLCBbdHJ1ZSwgXCJhbGxvdy1sZWFkaW5nLXVuZGVyc2NvcmVcIl0sIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFiZWxDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248QmFiZWxDb25maWd1cmF0aW9uPihcIkJhYmVsXCIpO1xuICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMsIFwicmVhY3RcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFByb3RyYWN0b3JDb25maWd1cmF0aW9uPihcIlByb3RyYWN0b3JcIik7XG4gICAgICAgIGlmIChwcm90cmFjdG9yQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBcInVuaXRlanMtcmVhY3QtcHJvdHJhY3Rvci1wbHVnaW5cIikpKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5wbHVnaW5zLCB7IHBhdGg6IHBsdWdpbiB9LCBtYWluQ29uZGl0aW9uLCAob2JqZWN0LCBpdGVtKSA9PiBvYmplY3QucGF0aCA9PT0gaXRlbS5wYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3ZWJkcml2ZXJJb1BsdWdpbnMgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJXZWJkcml2ZXJJTy5QbHVnaW5zXCIpO1xuICAgICAgICBpZiAod2ViZHJpdmVySW9QbHVnaW5zKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUod2ViZHJpdmVySW9QbHVnaW5zLCBcInVuaXRlanMtcmVhY3Qtd2ViZHJpdmVyLXBsdWdpblwiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGVTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VHlwZVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucywgXCJqc3hcIiwgXCJyZWFjdFwiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBcImV4cGVyaW1lbnRhbERlY29yYXRvcnNcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqYXZhU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEphdmFTY3JpcHRDb25maWd1cmF0aW9uPihcIkphdmFTY3JpcHRcIik7XG4gICAgICAgIGlmIChqYXZhU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShqYXZhU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwiZXhwZXJpbWVudGFsRGVjb3JhdG9yc1wiLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlRXh0ZW5zaW9uID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSwgXCJUeXBlU2NyaXB0XCIpID8gXCIudHNcIiA6IFwiLmpzXCI7XG5cbiAgICAgICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcbiAgICAgICAgICAgICAgICBgYXBwJHtzb3VyY2VFeHRlbnNpb259eGAsXG4gICAgICAgICAgICAgICAgYGNoaWxkL2NoaWxkJHtzb3VyY2VFeHRlbnNpb259eGAsXG4gICAgICAgICAgICAgICAgYGJvb3RzdHJhcHBlciR7c291cmNlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgYGVudHJ5UG9pbnQke3NvdXJjZUV4dGVuc2lvbn1gXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQXBwQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtgY2hpbGQvY2hpbGRgXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUUyZVRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BhcHAuc3BlYyR7c291cmNlRXh0ZW5zaW9ufWBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVVbml0VGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYGFwcC5zcGVjJHtzb3VyY2VFeHRlbnNpb259YCwgYGJvb3RzdHJhcHBlci5zcGVjJHtzb3VyY2VFeHRlbnNpb259YF0sIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
