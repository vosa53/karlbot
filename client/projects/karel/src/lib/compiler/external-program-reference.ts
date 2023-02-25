import { DataType } from "./data-type";

/**
 * Reference to an external program.
 */
export class ExternalProgramReference {
    /**
     * @param name Name of the external program.
     * @param returnType Return type of the external program.
     */
    constructor(readonly name: string, readonly returnType: DataType) {

    }
}