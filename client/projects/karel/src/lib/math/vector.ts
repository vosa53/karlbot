/**
 * 2D vector.
 */
export class Vector {
    /**
     * A vector instance with both x and y coordinates set to 0.
     */
    static readonly ZERO = new Vector(0, 0);

    /**
     * x coordinate.
     */
    readonly x: number;

    /**
     * y coordinate.
     */
    readonly y: number;

    /**
     * @param x x coordinate.
     * @param y y coordinate.
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the euclidean distance between `a` and `b`.
     * @param a Vector `a`.
     * @param b Vector `b`.
     */
    static calculateDistance(a: Vector, b: Vector) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
}