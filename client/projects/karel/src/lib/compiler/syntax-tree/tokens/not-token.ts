import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken, Token } from "./token";

/**
 * `not` keyword.
 */
export class NotToken extends Token {
    /**
     * @param primitiveToken Wrapped primitive token.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveToken: NotPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}

/**
 * `not` keyword.
 */
export class NotPrimitiveToken extends PrimitiveToken {
    override with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new NotPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof NotPrimitiveToken;
    }

    override createWrapper(parent: Node, position: number, startLine: number, startColumn: number): NotToken {
        return new NotToken(this, parent, position, startLine, startColumn);
    }
}