/**
 * Engine validation.
 */
import { ISpdx } from "../configuration/models/spdx/ISpdx";
import { IDisplay } from "../interfaces/IDisplay";
export declare class EngineValidation {
    static checkPackageName(display: IDisplay, name: string, value: string | undefined | null): boolean;
    static checkPattern(display: IDisplay, name: string, value: string | undefined | null, pattern: RegExp, patternExplain: string): boolean;
    static checkOneOf<T extends string>(display: IDisplay, name: string, value: T | undefined | null, values: T[]): boolean;
    static notEmpty(display: IDisplay, name: string, value: string | undefined | null): boolean;
    static checkLicense(licenseData: ISpdx, display: IDisplay, name: string, value: string | undefined | null): Promise<boolean>;
}
