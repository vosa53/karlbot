import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { ProgramToken } from "../tokens/program-token";
import { Token } from "../tokens/token";
import { Trivia } from "../trivia/trivia";
import { PrimitiveToken } from "./primitive-token";

export class ProgramPrimitiveToken extends PrimitiveToken {
    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof ProgramPrimitiveToken;
    }

    with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken {
        return new ProgramPrimitiveToken(
            newProperties.text === undefined ? this.text : newProperties.text,
            newProperties.leadingTrivia === undefined ? this.leadingTrivia : newProperties.leadingTrivia,
            newProperties.trailingTrivia === undefined ? this.trailingTrivia : newProperties.trailingTrivia
        );
    }

    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): ProgramToken {
        return new ProgramToken(this, parent, position, startLine, startColumn);
    }
}