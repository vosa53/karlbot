import { Node } from "../nodes/node";
import { NumberPrimitiveToken } from "../primitive-tokens/number-primitive-token";
import { Token } from "./token";

export class NumberToken extends Token {
    constructor(primitiveToken: NumberPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}