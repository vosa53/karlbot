import { Node } from "../nodes/node";
import { TimesPrimitiveToken } from "../primitive-tokens/times-primitive-token";
import { Token } from "./token";

export class TimesToken extends Token {
    constructor(primitiveToken: TimesPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}