import { PrimitiveSyntaxElement } from "../compiler/syntax-tree/syntax-element";

/**
 * Utils for {@link PrimitiveSyntaxElement}.
 */
export class PrimitiveSyntaxElementUtils {
    /**
     * Returns `true` when the syntax elements are equal according to {@link PrimitiveSyntaxElement.equals} or when they are both null. `false` otherwise.
     * @param first First syntax element.
     * @param second Second syntax element.
     */
    static equalsOrBothNull(first: PrimitiveSyntaxElement | null, second: PrimitiveSyntaxElement | null): boolean {
        return (first === null && second === null) || (first !== null && second !== null && first.equals(second));
    }
}