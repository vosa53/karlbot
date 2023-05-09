import { Rectangle, Vector } from "karel";
import { TownCamera } from "./town-camera";
import { TownRenderingEnvironment } from "./town-rendering-environment";
import { TownViewport } from "./town-viewport";

describe("TownCameraFactory", () => {
    it("pixelXToTileX - Converts x coordinate in pixels to x coordinate in tiles.", () => {
        const environment = new TownRenderingEnvironment(new TownCamera(new Vector(5, 5), 0.5), new TownViewport(200, 100), 10);
        expect(environment.pixelXToTileX(100)).toEqual(5);
    });

    it("pixelYToTileY - Converts y coordinate in pixels to y coordinate in tiles.", () => {
        const environment = new TownRenderingEnvironment(new TownCamera(new Vector(5, 5), 0.5), new TownViewport(200, 100), 10);
        expect(environment.pixelYToTileY(100)).toEqual(15);
    });

    it("tileXToPixelX - Converts x coordinate in tiles to x coordinate in pixels.", () => {
        const environment = new TownRenderingEnvironment(new TownCamera(new Vector(5, 5), 0.5), new TownViewport(200, 100), 10);
        expect(environment.tileXToPixelX(100)).toEqual(575);
    });

    it("tileYToPixelY - Converts y coordinate in tiles to y coordinate in pixels.", () => {
        const environment = new TownRenderingEnvironment(new TownCamera(new Vector(5, 5), 0.5), new TownViewport(200, 100), 10);
        expect(environment.tileYToPixelY(100)).toEqual(525);
    });

    it("getVisibleTileRegion - Returns a visible region in tile coordinates.", () => {
        const environment = new TownRenderingEnvironment(new TownCamera(new Vector(5, 5), 0.5), new TownViewport(200, 100), 10);
        expect(environment.getVisibleTileRegion()).toEqual(new Rectangle(-15, -5, 40, 20));
    });
});