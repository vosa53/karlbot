import { Direction } from "./direction";

/**
 * Utils for {@link Direction}.
 */
export class DirectionUtils {
    /**
     * Converts the direction to a unit vector.
     * @param direction Direction.
     */
    static toVector(direction: Direction): { x: number, y: number } {
        if (direction === Direction.up)
            return { x: 0, y: -1 };
        else if (direction === Direction.right)
            return { x: 1, y: 0 };
        else if (direction === Direction.down)
            return { x: 0, y: 1 };
        else if (direction === Direction.left)
            return { x: -1, y: 0 };
        else
            throw new Error("Unknown direction.");
    }
}