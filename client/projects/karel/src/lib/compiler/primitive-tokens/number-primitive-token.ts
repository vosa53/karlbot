import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { NumberToken } from "../tokens/number-token";
import { Token } from "../tokens/token";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken } from "./primitive-token";

export class NumberPrimitiveToken extends PrimitiveToken {
    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof NumberPrimitiveToken;
    }

    with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new NumberPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): NumberToken {
        return new NumberToken(this, parent, position, startLine, startColumn);
    }
}