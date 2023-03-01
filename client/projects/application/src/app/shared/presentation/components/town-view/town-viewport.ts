/**
 * Town viewport.
 */
export class TownViewport {
    /**
     * Pixel width.
     */
    readonly pixelWidth: number;

    /**
     * Pixel height.
     */
    readonly pixelHeight: number;

    /**
     * @param pixelWidth Pixel width.
     * @param pixelHeight Pixel height.
     */
    constructor(pixelWidth: number, pixelHeight: number) {
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }
}