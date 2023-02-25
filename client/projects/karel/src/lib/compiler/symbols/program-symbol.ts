import { ProgramNode } from "../syntax-tree/nodes/program-node";
import { Symbol } from "./symbol";

/**
 * Symbol for a program.
 */
export class ProgramSymbol extends Symbol {
    /**
     * Definition of the program to which the symbol refers.
     */
    readonly definition: ProgramNode;

    /**
     * @param definition Definition of the program to which the symbol refers.
     */
    constructor(definition: ProgramNode) {
        super();
        this.definition = definition;
    }
}