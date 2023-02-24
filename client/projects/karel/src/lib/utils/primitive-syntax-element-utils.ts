import { PrimitiveSyntaxElement } from "../compiler/primitive-syntax-element";

export class PrimitiveSyntaxElementUtils {
    static equalsOrBothNull(a: PrimitiveSyntaxElement | null, b: PrimitiveSyntaxElement | null): boolean {
        return (a === null && b === null) || (a !== null && b !== null && a.equals(b));
    }
}