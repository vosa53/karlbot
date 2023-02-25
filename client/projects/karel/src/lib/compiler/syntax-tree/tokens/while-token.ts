import { Node } from "../nodes/node";
import { WhilePrimitiveToken } from "../primitive-tokens/while-primitive-token";
import { Token } from "./token";

export class WhileToken extends Token {
    constructor(primitiveToken: WhilePrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}