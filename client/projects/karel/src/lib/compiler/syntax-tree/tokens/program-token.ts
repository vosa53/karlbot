import { Node } from "../nodes/node";
import { ProgramPrimitiveToken } from "../primitive-tokens/program-primitive-token";
import { Token } from "./token";

export class ProgramToken extends Token {
    constructor(primitiveToken: ProgramPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}