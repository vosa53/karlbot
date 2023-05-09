import { Vector } from "karel";
import { TownCamera } from "./town-camera";
import { TownCameraFactory } from "./town-camera-factory";

describe("TownCameraFactory", () => {
    it("fitContain - Creates a town camera in a landscape viewport.", () => {
        const camera = TownCameraFactory.fitContain(100, 50, 10, 20, 5);
        expect(camera).toEqual(new TownCamera(new Vector(5, 10), 0.5));
    });

    it("fitContain - Creates a town camera in a portrait viewport.", () => {
        const camera = TownCameraFactory.fitContain(200, 500, 10, 10, 10);
        expect(camera).toEqual(new TownCamera(new Vector(5, 5), 2));
    });
});