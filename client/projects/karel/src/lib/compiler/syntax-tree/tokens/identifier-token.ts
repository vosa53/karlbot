import { Node } from "../nodes/node";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { Token } from "./token";

export class IdentifierToken extends Token {
    constructor(primitiveToken: IdentifierPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}