import { Node } from "../nodes/node";
import { IfPrimitiveToken } from "../primitive-tokens/if-primitive-token";
import { Token } from "./token";

export class IfToken extends Token {
    constructor(primitiveToken: IfPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}