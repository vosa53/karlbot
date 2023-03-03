/**
 * 2D rectangle.
 */
export class Rectangle {
    /**
     * x coordinate.
     */
    readonly x: number;

    /**
     * y coordinate.
     */
    readonly y: number;

    /**
     * Width.
     */
    readonly width: number;

    /**
     * Height.
     */
    readonly height: number;

    /**
     * @param x x coordinate.
     * @param y y coordinate.
     * @param width Width.
     * @param height Height.
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}