import { Node } from "../compiler/syntax-tree/nodes/node";
import { PrimitiveSyntaxElement } from "../compiler/syntax-tree/syntax-element";
import { SyntaxElement } from "../compiler/syntax-tree/syntax-element";
import { ArrayUtils } from "./array-utils";
import { PrimitiveSyntaxElementUtils } from "./syntax-element-utils";

describe("PrimitiveSyntaxElementUtils", () => {
    it("equals - Returns true when syntax elements are equal.", () => {
        const first = new TestPrimitiveSyntaxElement(true);
        const second = new TestPrimitiveSyntaxElement(true);
        const result = PrimitiveSyntaxElementUtils.equalsOrBothNull(first, second);

        expect(result).toBeTrue();
    });

    it("equals - Returns false when syntax elements are not equal.", () => {
        const first = new TestPrimitiveSyntaxElement(false);
        const second = new TestPrimitiveSyntaxElement(false);
        const result = PrimitiveSyntaxElementUtils.equalsOrBothNull(first, second);

        expect(result).toBeFalse();
    });

    it("equals - Returns false when just one element is null.", () => {
        const first = new TestPrimitiveSyntaxElement(true);
        const second = null;
        const result = PrimitiveSyntaxElementUtils.equalsOrBothNull(first, second);
        const resultSwapped = PrimitiveSyntaxElementUtils.equalsOrBothNull(second, first);

        expect(result).toBeFalse();
        expect(resultSwapped).toBeFalse();
    });

    it("equals - Returns true when both elements are null.", () => {
        const first = null;
        const second = null;
        const result = PrimitiveSyntaxElementUtils.equalsOrBothNull(first, second);

        expect(result).toBeTrue();
    });
});

class TestPrimitiveSyntaxElement extends PrimitiveSyntaxElement {
    constructor(private readonly equalsReturnValue: boolean) {
        super(5, 1, 5, []);
    }

    equals(other: PrimitiveSyntaxElement): boolean {
        return this.equalsReturnValue;
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): SyntaxElement {
        throw new Error("Not supported.");
    }

    pushText(texts: string[]): void {
        throw new Error("Not supported.");
    }
}