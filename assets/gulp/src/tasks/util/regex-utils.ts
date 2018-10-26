
/**
 * Gulp utils for reg ex.
 */
import * as stream from "stream";
import * as through2 from "through2";

export function toWebUrl(file: string): string {
    return file.replace(/\\/g, "/");
}

export function stripJsExtension(file: string): string {
    return file.replace(/(\.js)$/, "");
}

export function stripLeadingSlash(file: string): string {
    return file.replace(/^\.\//, "");
}

export function replaceLeadingSlash(file: string, replace: string): string {
    return file.replace(/^\.\//, replace);
}

export function multiReplace(replacements: { [id: string]: string }): stream.Transform {
    return through2.obj((file, encode, callback) => {
        let contents = file.contents.toString();

        if (replacements) {
            Object.keys(replacements).forEach(replacement => {
                contents = contents.replace(new RegExp(replacement, "g"), replacements[replacement]);
            });
        }

        file.contents = Buffer.from(contents);
        callback(null, file);
    });
}

// Generated by UniteJS
