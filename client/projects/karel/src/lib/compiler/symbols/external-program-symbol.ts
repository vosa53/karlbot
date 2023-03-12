import { ExternalProgramReference } from "../external-program-reference";
import { Symbol_ } from "./symbol";

/**
 * Symbol for an external program.
 */
export class ExternalProgramSymbol extends Symbol_ {
    /**
     * Reference of the external program to which the symbol refers.
     */
    readonly externalProgram: ExternalProgramReference;

    /**
     * @param externalProgram Reference of the external program to which the symbol refers.
     */
    constructor(externalProgram: ExternalProgramReference) {
        super();
        this.externalProgram = externalProgram;
    }
}