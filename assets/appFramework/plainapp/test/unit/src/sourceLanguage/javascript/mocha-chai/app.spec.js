/**
 * Tests for App.
 */
import {App} from "../../../src/app";
import Chai from "chai";

describe("App", () => {
    it("can be created", (done) => {
        const app = new App();
        Chai.should().exist(app);
        done();
    });
});

/* Generated by UniteJS */
