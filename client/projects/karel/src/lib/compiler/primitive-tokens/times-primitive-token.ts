import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { TimesToken } from "../tokens/times-token";
import { Token } from "../tokens/token";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken } from "./primitive-token";

export class TimesPrimitiveToken extends PrimitiveToken {
    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof TimesPrimitiveToken;
    }

    with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new TimesPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): TimesToken {
        return new TimesToken(this, parent, position, startLine, startColumn);
    }
}