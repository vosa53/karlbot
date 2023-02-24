import { Node } from "../nodes/node";
import { ElsePrimitiveToken } from "../primitive-tokens/else-primitive-token";
import { Token } from "./token";

export class ElseToken extends Token {
    constructor(primitiveToken: ElsePrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}