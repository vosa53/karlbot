import { Node } from "../nodes/node";
import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { Token } from "./token";

export class EndOfFileToken extends Token {
    constructor(primitiveToken: EndOfFilePrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}