/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteLanguage } from "./uniteLanguage";

export class UniteConfiguration {
    public name: string;
    public language: UniteLanguage;
}