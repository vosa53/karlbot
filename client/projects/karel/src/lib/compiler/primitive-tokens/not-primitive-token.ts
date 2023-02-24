import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { NotToken } from "../tokens/not-token";
import { Token } from "../tokens/token";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken } from "./primitive-token";

export class NotPrimitiveToken extends PrimitiveToken {
    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof NotPrimitiveToken;
    }

    with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new NotPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): NotToken {
        return new NotToken(this, parent, position, startLine, startColumn);
    }
}