/**
 * Tests for App.
 */
/// <reference types="unitejs-webdriver-plugin"/>

describe("App", () => {
    it("the title is set", () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteThemeJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .element("#root")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });

    it("the font size is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .element(".child")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).toEqual("20px");
            });
    });
});

// Generated by UniteJS
