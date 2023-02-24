export class ArrayUtils {
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