import { TownCamera } from "./town-camera";
import { Rectangle } from "karel";
import { TownViewport } from "./town-viewport";

/**
 * Environment in which a town is rendered.
 */
export class TownRenderingEnvironment {
    /**
     * Camera used for rendering.
     */
    readonly camera: TownCamera;

    /**
     * Viewport used for rendering.
     */
    readonly viewport: TownViewport;

    /**
     * Pixel size of one tile **before** the camera zoom is applied.
     */
    readonly originalTilePixelSize: number;

    /**
     * @param camera Camera used for rendering.
     * @param viewport Viewport used for rendering.
     * @param originalTilePixelSize Pixel size of one tile **before** the camera zoom is applied.
     */
    constructor(camera: TownCamera, viewport: TownViewport, originalTilePixelSize: number) {
        this.camera = camera;
        this.viewport = viewport;
        this.originalTilePixelSize = originalTilePixelSize;
    }

    /**
     * Pixel size of one tile **after** the camera zoom is applied.
     */
    get tilePixelSize(): number {
        return this.originalTilePixelSize * this.camera.zoomLevel;
    }

    /**
     * Converts x coordinate in pixels to x coordinate in tiles.
     * @param x x coordinate in pixels.
     */
    pixelXToTileX(x: number): number {
        return this.camera.centerTile.x + (x - this.viewport.pixelWidth * 0.5) / this.tilePixelSize;
    }

    /**
     * Converts y coordinate in pixels to y coordinate in tiles.
     * @param y y coordinate in pixels.
     */
    pixelYToTileY(y: number): number {
        return this.camera.centerTile.y + (y - this.viewport.pixelHeight * 0.5) / this.tilePixelSize;
    }

    /**
     * Converts x coordinate in tiles to x coordinate in pixels.
     * @param x x coordinate in tiles.
     */
    tileXToPixelX(x: number): number {
        return this.viewport.pixelWidth * 0.5 + (x - this.camera.centerTile.x) * this.tilePixelSize;
    }

    /**
     * Converts y coordinate in tiles to y coordinate in pixels.
     * @param y y coordinate in tiles.
     */
    tileYToPixelY(y: number): number {
        return this.viewport.pixelHeight * 0.5 + (y - this.camera.centerTile.y) * this.tilePixelSize;
    }

    /**
     * Returns a visible region in tile coordinates.
     */
    getVisibleTileRegion(): Rectangle {
        const tileWidth = this.viewport.pixelWidth / this.tilePixelSize;
        const tileHeight = this.viewport.pixelHeight / this.tilePixelSize;

        const tileX = this.camera.centerTile.x - (tileWidth / 2);
        const tileY = this.camera.centerTile.y - (tileHeight / 2);
        
        return new Rectangle(tileX, tileY, tileWidth, tileHeight);
    }
}