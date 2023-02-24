/**
 * Utils for {@link Array}.
 */
export class ArrayUtils {
    /**
     * Returns `true` when the arrays are equal. `false` otherwise.
     * @param first First array.
     * @param second Second array.
     * @param elementEquals Function to compare individual elements of the arrays. Returns `true` when the provided elements are equal. `false` otherwise.
     */
    static equals<T>(first: readonly T[], second: readonly T[], elementEquals: (first: T, second: T) => boolean) {
        if (first.length !== second.length)
            return false;

        for (let i = 0; i < first.length; i++) {
            if (!elementEquals(first[i], second[i]))
                return false;
        }
        return true;
    }
}