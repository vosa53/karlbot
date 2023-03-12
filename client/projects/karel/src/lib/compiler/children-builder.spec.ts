import { ChildrenBuilder } from "./children-builder";
import { SyntaxError } from "./errors/syntax-error";
import { LineTextRange } from "./line-text-range";
import { Node } from "./syntax-tree/nodes/node";
import { PrimitiveSyntaxElement } from "./syntax-tree/syntax-element";
import { SyntaxElement } from "./syntax-tree/syntax-element";

describe("ChildrenBuilder", () => {
    it("addChild - Adds a child.", () => {
        const childrenBuilder = new ChildrenBuilder();
        const child = new TestPrimitiveSyntaxElement(5, 2, 3, []);
        
        childrenBuilder.addChild(child);

        expect(childrenBuilder.children).toEqual([child]);
    });

    it("addChildOrError - Adds a child when the child is not null.", () => {
        const childrenBuilder = new ChildrenBuilder();
        const child = new TestPrimitiveSyntaxElement(5, 2, 3, []);
        
        childrenBuilder.addChildOrError(child, "Some error");

        expect(childrenBuilder.children).toEqual([child]);
        expect(childrenBuilder.syntaxErrors).toEqual([]);
    });

    it("addChildOrError - Adds an error when the child is null.", () => {
        const childrenBuilder = new ChildrenBuilder();
        
        childrenBuilder.addChildOrError(null, "Some error");

        expect(childrenBuilder.syntaxErrors).toEqual([new SyntaxError("Some error", new LineTextRange(1, 1, 1, 2))]);
        expect(childrenBuilder.children).toEqual([]);
    });

    it("length - Is equal to the sum of children lengths.", () => {
        const childrenBuilder = new ChildrenBuilder();
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(3, 1, 3, []));
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(2, 1, 2, []));

        expect(childrenBuilder.length).toBe(5);
    });

    it("length - Is 0 without added children.", () => {
        const childrenBuilder = new ChildrenBuilder();
        expect(childrenBuilder.length).toBe(0);
    });

    it("lineCount - Is equal to the total children line counts.", () => {
        const childrenBuilder = new ChildrenBuilder();
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(5, 2, 5, []));
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(5, 1, 5, []));
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(5, 3, 5, []));

        expect(childrenBuilder.lineCount).toBe(4);
    });

    it("lineCount - Is 1 without added children.", () => {
        const childrenBuilder = new ChildrenBuilder();
        expect(childrenBuilder.lineCount).toBe(1);
    });

    it("lastLineLength - Is equal to the total children last line length.", () => {
        const childrenBuilder = new ChildrenBuilder();
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(4, 1, 4, []));
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(10, 3, 2, []));
        childrenBuilder.addChild(new TestPrimitiveSyntaxElement(3, 1, 3, []));

        expect(childrenBuilder.lastLineLength).toBe(5);
    });

    it("lastLineLength - Is 0 without added children.", () => {
        const childrenBuilder = new ChildrenBuilder();
        expect(childrenBuilder.lastLineLength).toBe(0);
    });
});

class TestPrimitiveSyntaxElement extends PrimitiveSyntaxElement {
    equals(other: PrimitiveSyntaxElement): boolean {
        throw new Error("Not supported.");
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): SyntaxElement {
        throw new Error("Not supported.");
    }

    pushText(texts: string[]): void {
        throw new Error("Not supported.");
    }
}