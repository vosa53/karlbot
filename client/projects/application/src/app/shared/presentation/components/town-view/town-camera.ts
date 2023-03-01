/**
 * Camera for rendering a town.
 */
export class TownCamera {
    /**
     * Center tile x coordinate.
     */
    readonly centerTileX: number;

    /**
     * Center tile y coordinate.
     */
    readonly centerTileY: number;

    /**
     * Zoom level.
     */
    readonly zoomLevel: number;

    /**
     * @param centerTileX Center tile x coordinate.
     * @param centerTileY Center tile y coordinate.
     * @param zoomLevel Zoom level.
     */
    constructor(centerTileX: number, centerTileY: number, zoomLevel: number) {
        if (zoomLevel <= 0)
            throw new Error("Zoom level must be a positive number.");
        
        this.centerTileX = centerTileX;
        this.centerTileY = centerTileY;
        this.zoomLevel = zoomLevel;
    }
}