import { LineTextRange } from "../line-text-range";
import { Node } from "../nodes/node";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { SyntaxElement } from "../syntax-element";
import { TextRange } from "../text-range";
import { Trivia } from "../trivia/trivia";

export abstract class Token extends SyntaxElement {
    get text(): string {
        return (<PrimitiveToken>this.primitive).text;
    }

    get leadingTrivia(): readonly Trivia[] {
        return (<PrimitiveToken>this.primitive).leadingTrivia;
    }

    get trailingTrivia(): readonly Trivia[] {
        return (<PrimitiveToken>this.primitive).trailingTrivia;
    }

    constructor(primitiveToken: PrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn)
    }

    getTextRangeWithoutTrivia(): TextRange {
        const primitiveToken = (<PrimitiveToken>this.primitive);

        return new TextRange(
            this.position + primitiveToken.textPosition,
            primitiveToken.text.length
        );
    }

    getLineTextRangeWithoutTrivia(): LineTextRange {
        const primitiveToken = (<PrimitiveToken>this.primitive);

        return new LineTextRange(
            this.startLine + primitiveToken.textStartLine - 1,
            primitiveToken.textStartLine > 1 ? primitiveToken.textStartColumn : this.startColumn + primitiveToken.textStartColumn - 1,
            this.startLine + primitiveToken.textEndLine - 1,
            primitiveToken.textEndLine > 1 ? primitiveToken.textEndColumn : this.startColumn + primitiveToken.textEndColumn - 1
        );
    }
}