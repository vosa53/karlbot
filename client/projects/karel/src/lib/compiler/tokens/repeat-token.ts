import { Node } from "../nodes/node";
import { RepeatPrimitiveToken } from "../primitive-tokens/repeat-primitive-token";
import { Token } from "./token";

export class RepeatToken extends Token {
    constructor(primitiveToken: RepeatPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}