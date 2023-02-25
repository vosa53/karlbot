import { ChildrenBuilder } from "./children-builder";
import { SyntaxError } from "./errors/syntax-error";
import { LineTextRange } from "./line-text-range";
import { Node } from "./syntax-tree/nodes/node";
import { PrimitiveSyntaxElement } from "./syntax-tree/primitive-syntax-element";
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