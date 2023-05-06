import { Vector } from "karel";
import { TownCamera } from "./town-camera";

/**
 * Factory for {@link TownCamera}.
 */
export class TownCameraFactory {
    /**
     * Creates a town camera so that it fits exactly to the given viewport and at the same time shows the whole town.
     * @param viewportWidth Viewport width in pixels.
     * @param viewportHeight Viewport height in pixels.
     * @param townWidth Town width in tiles.
     * @param townHeight Town height in tiles.
     * @param tileSize Tile size in pixels.
     */
    static fitContain(viewportWidth: number, viewportHeight: number, townWidth: number, townHeight: number, tileSize: number): TownCamera {
        const viewportAspectRatio = viewportWidth / viewportHeight;
        const townAspectRatio = townWidth / townHeight;

        const zoomLevel = viewportAspectRatio > townAspectRatio 
            ? viewportHeight / (townHeight * tileSize)
            : viewportWidth / (townWidth * tileSize);

        const centerTile = new Vector(townWidth / 2, townHeight / 2);
        return new TownCamera(centerTile, zoomLevel);
    }
}