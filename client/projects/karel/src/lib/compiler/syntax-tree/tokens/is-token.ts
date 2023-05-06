import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken, Token } from "./token";

/**
 * `is` keyword.
 */
export class IsToken extends Token {
    /**
     * @param primitiveToken Wrapped primitive token.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveToken: IsPrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn);
    }
}

/**
 * `is` keyword.
 */
export class IsPrimitiveToken extends PrimitiveToken {
    override with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new IsPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof IsPrimitiveToken;
    }

    override createWrapper(parent: Node, position: number, startLine: number, startColumn: number): IsToken {
        return new IsToken(this, parent, position, startLine, startColumn);
    }
}