/**
 * Tests for App.
 */
/// <reference path="../e2e-bootstrap.d.ts" />
describe("App", () => {
    it("the title is set", () => {
        const uniteJson = require("../../../../unite.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .loadAndWaitForPage("/")
            .element("#root")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });
});

/* Generated by UniteJS */
