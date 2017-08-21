/**
 * Tests for CommonJs.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../dist/configuration/models/babel/babelConfiguration";
import { HtmlTemplateConfiguration } from "../../../../../dist/configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { KarmaConfiguration } from "../../../../../dist/configuration/models/karma/karmaConfiguration";
import { TypeScriptConfiguration } from "../../../../../dist/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { CommonJs } from "../../../../../dist/pipelineSteps/moduleType/commonJs";
import { FileSystemMock } from "../../fileSystem.mock";

describe("CommonJs", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.moduleType = "CommonJS";
        uniteConfigurationStub.unitTestRunner = "Karma";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new CommonJs();
        Chai.should().exist(obj);
    });

    describe("process", () => {
        it("can be called with mismatched module type", async () => {
            uniteConfigurationStub.moduleType = "AMD";
            const obj = new CommonJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.systemjs).to.be.equal(undefined);
        });

        it("can be called with matching module type and no engine configuration", async () => {
            const obj = new CommonJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.systemjs).to.be.equal("1.2.3");
            Chai.expect(uniteConfigurationStub.srcDistReplaceWith).to.be.equal("../dist/");
        });

        it("can throw exception", async () => {
            engineVariablesStub.setConfiguration("Karma", {});
            sandbox.stub(fileSystemMock, "pathToWeb").throws("error");
            const obj = new CommonJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can be called with matching module type and engine configuration", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("Babel", { presets: []});
            engineVariablesStub.setConfiguration("Karma", { files: []});
            engineVariablesStub.setConfiguration("HTMLNoBundle", { scriptIncludes: [], body: []});
            engineVariablesStub.setConfiguration("HTMLBundle", { body: []});

            const obj = new CommonJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal("commonjs");
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("commonjs");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").scriptIncludes.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(8);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLBundle").body.length).to.be.equal(3);
        });

        it("can be called with matching module type and engine configuration, existing babel", async () => {
            engineVariablesStub.setConfiguration("Babel", { presets: [["es2015", { modules: "amd" }]]});

            const obj = new CommonJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("commonjs");
        });
    });
});
