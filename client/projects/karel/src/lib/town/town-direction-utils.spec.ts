import { Vector } from "../math/vector";
import { TownDirection } from "./town-direction";
import { TownDirectionUtils } from "./town-direction-utils";

describe("TownDirectionUtils", () => {
    it("toVector - Converts a direction into a vector when the direction is valid.", () => {
        expect(TownDirectionUtils.toVector(TownDirection.up)).toEqual(new Vector(0, -1));
        expect(TownDirectionUtils.toVector(TownDirection.right)).toEqual(new Vector(1, 0));
        expect(TownDirectionUtils.toVector(TownDirection.down)).toEqual(new Vector(0, 1));
        expect(TownDirectionUtils.toVector(TownDirection.left)).toEqual(new Vector(-1, 0));
    });

    it("toVector - Throws an error when the direction is valid.", () => {
        expect(() => TownDirectionUtils.toVector(4 as TownDirection)).toThrowError();
    });

    it("fromVector - Converts a vector into a direction when the vector corresponds to some town direction.", () => {
        expect(TownDirectionUtils.fromVector(0, -1)).toEqual(TownDirection.up);
        expect(TownDirectionUtils.fromVector(1, 0)).toEqual(TownDirection.right);
        expect(TownDirectionUtils.fromVector(0, 1)).toEqual(TownDirection.down);
        expect(TownDirectionUtils.fromVector(-1, 0)).toEqual(TownDirection.left);
    });

    it("fromVector - Throws an error when the vector does not correspond to any town direction.", () => {
        expect(() => TownDirectionUtils.fromVector(0, 0)).toThrowError();
        expect(() => TownDirectionUtils.fromVector(1, 1)).toThrowError();
    });

    it("fromVector - Throws an error when the vector is not a unit vector.", () => {
        expect(() => TownDirectionUtils.fromVector(2, 0)).toThrowError();
        expect(() => TownDirectionUtils.fromVector(0, -3)).toThrowError();
    });
});
