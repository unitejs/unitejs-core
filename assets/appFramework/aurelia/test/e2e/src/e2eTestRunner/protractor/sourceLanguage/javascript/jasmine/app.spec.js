/**
 * Tests for App.
 */
describe("App", () => {
    it("the title is set", (done) => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteThemeJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
                $("router-view").getText()
                    .then((routerContent) => {
                        expect(routerContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });

    it("the font size is set", (done) => {
        browser.uniteLoadAndWaitForPage("/")
            .then(() => {
               $(".child").getCssValue("font-size")
                    .then((fontSize) => {
                        expect(fontSize).toEqual("20px");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */
