/**
 * Tests for Electron.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Electron } from "../../../../../dist/pipelineSteps/platform/electron";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Electron", () => {
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
        uniteConfigurationStub.platforms = { Electron: {}};
        uniteConfigurationStub.taskManager = "Gulp";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Electron();
        Chai.should().exist(obj);
    });

    describe("process", () => {
        it("can be called with mismatched platform", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["// Generated by UniteJS"]);
            const stub = sandbox.stub(fileSystemMock, "fileDelete").resolves(0);
            uniteConfigurationStub.platforms = {};
            const obj = new Electron();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(2);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal(undefined);
        });

        it("can be called with mismatched platform and not existing", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            const stub = sandbox.stub(fileSystemMock, "fileDelete").rejects("error");
            uniteConfigurationStub.platforms = {};
            const obj = new Electron();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(stub.callCount).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal(undefined);
        });

        it("can fail writing copying task file", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadBinary").rejects("error");
            const obj = new Electron();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal("1.2.3");
        });

        it("can fail writing copying asset file", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadBinary").resolves().onSecondCall().rejects("error");
            sandbox.stub(fileSystemMock, "fileWriteBinary").resolves();
            const obj = new Electron();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal("1.2.3");
        });
    });
});
