/**
 * Tests for App.
 */
import { $, browser, by } from "protractor";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../../unite.json");
        browser.loadAndWaitForAureliaPage("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteJson.title);
                        done();
                    });
            });
    });

    it("the router text is set", (done) => {
        browser.loadAndWaitForAureliaPage("/")
            .then(() => {
                $("router-view").getText()
                    .then((routerContent) => {
                        expect(routerContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */
