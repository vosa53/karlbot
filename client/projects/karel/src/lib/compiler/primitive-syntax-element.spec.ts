import { ChildrenBuilder } from "./children-builder";
import { SyntaxError } from "./errors/syntax-error";
import { LineTextRange } from "./line-text-range";
import { Node } from "./nodes/node";
import { PrimitiveSyntaxElement } from "./primitive-syntax-element";
import { SyntaxElement } from "./syntax-element";

describe("PrimitiveSyntaxElement", () => {
    it("buildText - Creates a text from the text parts returned from the method 'pushText'.", () => {
        const textParts = ["abcde", "aaa", "123"];
        const element = new TestPrimitiveSyntaxElement(11, 1, 11, [], textParts);

        expect(element.buildText()).toBe("abcdeaaa123");
    });

    it("buildText - Creates an empty text when the text parts returned from the 'pushText' method are empty.", () => {
        const textParts: string[] = [];
        const element = new TestPrimitiveSyntaxElement(0, 1, 0, [], textParts);

        expect(element.buildText()).toBe("");
    });
});

class TestPrimitiveSyntaxElement extends PrimitiveSyntaxElement {
    constructor(length: number, lineCount: number, lastLineLength: number, syntaxErrors: readonly SyntaxError[], private textParts: string[]) {
        super(length, lineCount, lastLineLength, syntaxErrors);
    }

    equals(other: PrimitiveSyntaxElement): boolean {
        throw new Error("Not supported.");
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): SyntaxElement {
        throw new Error("Not supported.");
    }

    pushText(texts: string[]): void {
        texts.push(...this.textParts);
    }
}