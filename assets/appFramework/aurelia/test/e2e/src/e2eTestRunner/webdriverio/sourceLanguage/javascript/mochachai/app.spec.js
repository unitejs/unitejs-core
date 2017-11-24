/**
 * Tests for App.
 */
import { expect } from "chai";

describe("App", () => {
    it("the title is set", () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).to.equal(uniteThemeJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .element("router-view")
            .getText()
            .then((routerContent) => {
                expect(routerContent).to.equal("Hello UniteJS World!");
            });
    });

    it("the font size is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .element(".child")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).to.equal("20px");
            });
    });
});

/* Generated by UniteJS */
