import { Node } from "../nodes/node";
import { EndPrimitiveToken } from "../primitive-tokens/end-primitive-token";
import { Token } from "./token";

export class EndToken extends Token {
    constructor(primitiveToken: EndPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}