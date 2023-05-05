import { Vector } from "./vector";

describe("Vector", () => {
    it("calculateDistance - Returns the euclidean distance between two vectors.", () => {
        const first = new Vector(7, -2);
        const second = new Vector(11.5, 4);
        const result = Vector.calculateDistance(first, second);

        expect(result).toBeCloseTo(7.5);
    });

    it("calculateDistance - Returns zero when the vectors are equal.", () => {
        const first = new Vector(-23.75, 21.7);
        const second = new Vector(-23.75, 21.7);
        const result = Vector.calculateDistance(first, second);

        expect(result).toBeCloseTo(0);
    });
});