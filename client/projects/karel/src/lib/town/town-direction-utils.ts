import { Vector } from "../math/vector";
import { TownDirection } from "./town-direction";

/**
 * Utils for {@link TownDirection}.
 */
export class TownDirectionUtils {
    private static readonly UP_VECTOR = new Vector(0, -1);
    private static readonly RIGHT_VECTOR = new Vector(1, 0);
    private static readonly DOWN_VECTOR = new Vector(0, 1);
    private static readonly LEFT_VECTOR = new Vector(-1, 0);

    /**
     * Converts the direction to a unit vector.
     * @param direction Direction.
     */
    static toVector(direction: TownDirection): Vector {
        if (direction === TownDirection.up)
            return this.UP_VECTOR;
        else if (direction === TownDirection.right)
            return this.RIGHT_VECTOR;
        else if (direction === TownDirection.down)
            return this.DOWN_VECTOR;
        else if (direction === TownDirection.left)
            return this.LEFT_VECTOR;
        else
            throw new Error("Unknown direction.");
    }

    /**
     * Converts the given unit vector to a direction.
     * @param x Vector x coordinate.
     * @param y Vector y coordinate.
     */
    static fromVector(x: number, y: number): TownDirection {
        if (x === 0 && y === -1)
            return TownDirection.up;
        else if (x === 1 && y === 0)
            return TownDirection.right;
        else if (x === 0 && y === 1)
            return TownDirection.down;
        else if (x === -1 && y === 0)
            return TownDirection.left;
        else
            throw new Error("Unknown direction.");
    }
}