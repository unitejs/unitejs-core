/**
 * Tests for Bootstrapper.
 */
import Chai from "chai";
import {bootstrap} from "../../../src/bootstrapper";

describe("Bootstrapper", () => {
    it("should contain bootstrap", (done) => {
        Chai.should().exist(bootstrap);
        done();
    });
});

/* Generated by UniteJS */
