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
}