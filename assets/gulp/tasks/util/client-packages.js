/**
 * Gulp utils for client packages.
 */
const path = require("path");

function getKeys (uniteConfig, includeModes) {
    const pathKeys = [];
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            pathKeys.push(keys[i]);
        }
    }

    return pathKeys;
}

function getFiles (uniteConfig, includeModes, isMinified) {
    const files = {};
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            const mainSplit = isMinified && pkg.mainMinified ? pkg.mainMinified.split("/") : pkg.main.split("/");
            const main = mainSplit.pop();
            const location = mainSplit.join("/");
            if (pkg.isPackage) {
                files[keys[i]] = path.join(`${uniteConfig.dirs.www.package}${keys[i]}/${location}`,
                    "**/*.{js,html,css}");
            } else {
                files[keys[i]] = path.join(`${uniteConfig.dirs.www.package}${keys[i]}/${location}`, main);
            }
        }
    }

    return files;
}

function buildModuleConfig (uniteConfig, includeModes, isMinified) {
    const moduleConfig = {
        "paths": {},
        "packages": [],
        "preload": []
    };

    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            const mainSplit = isMinified && pkg.mainMinified ? pkg.mainMinified.split("/") : pkg.main.split("/");
            const main = mainSplit.pop().replace(/(\.js)$/, "");
            let location = mainSplit.join("/");

            if (pkg.isPackage) {
                moduleConfig.packages.push({
                    "name": keys[i],
                    "location": `${uniteConfig.dirs.www.package}${keys[i]}/${location}`,
                    main
                });
            } else {
                location += location.length > 0 ? "/" : "";
                moduleConfig.paths[keys[i]] = `${uniteConfig.dirs.www.package}${keys[i]}/${location}${main}`;
            }

            if (pkg.preload) {
                moduleConfig.preload.push(keys[i]);
            }
        }
    }

    return moduleConfig;
}

module.exports = {
    buildModuleConfig,
    getFiles,
    getKeys
};

/* Generated by UniteJS */
