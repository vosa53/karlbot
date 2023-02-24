import { ArrayUtils } from "./array-utils";

describe("ArrayUtils", () => {
    it("equals - Returns true when all elements are equal and arrays have the same size.", () => {
        const first = [1, 2, 3];
        const second = [3, 4, 5];
        const result = ArrayUtils.equals(first, second, (f, s) => f + 2 === s);

        expect(result).toBeTrue();
    });

    it("equals - Returns true when both arrays are empty.", () => {
        const result = ArrayUtils.equals([], [], () => false);
        expect(result).toBeTrue();
    });

    it("equals - Returns false when the arrays have different length.", () => {
        const first = [1, 2, 3];
        const second = [1, 2];
        const result = ArrayUtils.equals(first, second, (f, s) => f === s);

        expect(result).toBeFalse();
    });

    it("equals - Returns false when some elements are not equal.", () => {
        const first = [1, 2, 3];
        const second = [2, 1, 3];
        const result = ArrayUtils.equals(first, second, (f, s) => f === s);

        expect(result).toBeFalse();
    });
});