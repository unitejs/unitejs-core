/**
 * Main entry point for app.
 */
import { bootstrap } from "aurelia-bootstrapper";
import { Aurelia } from "aurelia-framework";
declare var unite: { config: { name: string }};

bootstrap((aurelia: Aurelia) => {
    aurelia.use
        .standardConfiguration()
        .plugin("aurelia-dialog")
        .plugin("aurelia-validation");

    if (unite.config.name === "dev") {
        aurelia.use.developmentLogging();
    }

    return aurelia.start()
        .then(() => {
            aurelia.setRoot("dist/app", document.body);
            document.body.setAttribute("aurelia-app", "");
            Object.defineProperty(document.body, "aurelia", { value: aurelia });
        });
});

/* Generated by UniteJS */
