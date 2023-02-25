import { ExternalProgramReference } from "../external-program-reference";
import { Symbol } from "./symbol";

export class ExternalProgramSymbol extends Symbol {
    readonly externalProgram: ExternalProgramReference;

    constructor(externalProgram: ExternalProgramReference) {
        super();
        this.externalProgram = externalProgram;
    }
}