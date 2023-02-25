import { Node } from "../nodes/node";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { Token } from "./token";

export class NotToken extends Token {
    constructor(primitiveToken: NotPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}