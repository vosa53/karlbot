import { Vector } from "projects/karel/src/public-api";
import { TownCamera } from "./town-camera";

export class TownCameraFactory {
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