import { Vector } from "projects/karel/src/lib/math/vector";

/**
 * Camera for rendering a town.
 */
export class TownCamera {
    /**
     * Tile coordinates of the viewport center.
     */
    readonly centerTile: Vector;

    /**
     * Zoom level. The bigger, the larger the resulting tile pixel size will be.
     */
    readonly zoomLevel: number;

    /**
     * @param centerTile Tile coordinates of the viewport center.
     * @param zoomLevel Zoom level. The bigger, the larger the resulting tile pixel size will be.
     */
    constructor(centerTile: Vector, zoomLevel: number) {
        if (zoomLevel <= 0)
            throw new Error("Zoom level must be a positive number.");
        
        this.centerTile = centerTile;
        this.zoomLevel = zoomLevel;
    }
}