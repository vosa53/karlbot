import { ProgramNode } from "../syntax-tree/nodes/program-node";
import { Symbol } from "./symbol";

export class ProgramSymbol extends Symbol {
    readonly definition: ProgramNode;

    constructor(definition: ProgramNode) {
        super();
        this.definition = definition;
    }
}