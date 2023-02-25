import { Node } from "../nodes/node";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { Token } from "./token";

export class IsToken extends Token {
    constructor(primitiveToken: IsPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}