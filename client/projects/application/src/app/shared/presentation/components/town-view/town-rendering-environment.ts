import { TownCamera } from "./town-camera";
import { TownViewport } from "./town-viewport";

/**
 * Town rendering environment.
 */
export class TownRenderingEnvironment {
    /**
     * Camera.
     */
    readonly camera: TownCamera;

    /**
     * Viewport.
     */
    readonly viewport: TownViewport;

    /**
     * Pixel size of a tile before the camera zoom is applied.
     */
    readonly originalTilePixelSize: number;

    /**
     * @param camera Camera.
     * @param viewport Viewport.
     * @param originalTilePixelSize Pixel size of a tile before the camera zoom is applied.
     */
    constructor(camera: TownCamera, viewport: TownViewport, originalTilePixelSize: number) {
        this.camera = camera;
        this.viewport = viewport;
        this.originalTilePixelSize = originalTilePixelSize;
    }

    /**
     * Pixel size of a tile after the camera zoom is applied.
     */
    get tilePixelSize(): number {
        return this.originalTilePixelSize * this.camera.zoomLevel;
    }

    /**
     * Converts x coordinate in pixels to x coordinate in tiles.
     * @param x x coordinate in pixels.
     */
    pixelXToTileX(x: number): number {
        return this.camera.centerTileX + (x - this.viewport.pixelWidth * 0.5) / this.originalTilePixelSize;
    }

    /**
     * Converts y coordinate in pixels to y coordinate in tiles.
     * @param y y coordinate in pixels.
     */
    pixelYToTileY(y: number): number {
        return this.camera.centerTileY + (y - this.viewport.pixelHeight * 0.5) / this.originalTilePixelSize;
    }

    /**
     * Converts x coordinate in tiles to x coordinate in pixels.
     * @param x x coordinate in tiles.
     */
    tileXToPixelX(x: number): number {
        return this.viewport.pixelWidth * 0.5 + (x - this.camera.centerTileX) * this.originalTilePixelSize;
    }

    /**
     * Converts y coordinate in tiles to y coordinate in pixels.
     * @param y y coordinate in tiles.
     */
    tileYToPixelY(y: number): number {
        return this.viewport.pixelHeight * 0.5 + (y - this.camera.centerTileY) * this.originalTilePixelSize;
    }

    /**
     * Returns a visible region in tile coordinates.
     */
    getVisibleTileRegion(): { top: number, right: number, bottom: number, left: number } {
        const viewportTileWidth = this.viewport.pixelWidth / this.tilePixelSize;
        const viewportTileHeight = this.viewport.pixelHeight / this.tilePixelSize;

        const left = this.camera.centerTileX - (viewportTileWidth / 2);
        const top = this.camera.centerTileY - (viewportTileHeight / 2);

        const right = left + viewportTileWidth;
        const bottom = top + viewportTileHeight;
        
        return { top, right, bottom, left };
    }
}