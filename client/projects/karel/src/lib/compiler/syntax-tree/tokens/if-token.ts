import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken, Token } from "./token";

export class IfToken extends Token {
    constructor(primitiveToken: IfPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}

export class IfPrimitiveToken extends PrimitiveToken {
    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof IfPrimitiveToken;
    }

    with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new IfPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): IfToken {
        return new IfToken(this, parent, position, startLine, startColumn);
    }
}