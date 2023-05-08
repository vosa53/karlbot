import { Vector } from "../math/vector";
import { Town } from "./town";
import { TownDeserializer } from "./town-deserializer";
import { TownDirection } from "./town-direction";
import { TownTile } from "./town-tile";

describe("TownDeserialzer", () => {
    it("deserialize - Deserializes a town from a JSON.", () => {
        const townObject = {
            width: 2,
            height: 2,
            karelPosition: { x: 1, y: 1 },
            karelDirection: 0,
            homePosition: { x: 1, y: 0 },
            tiles: [0, 0, 1, 0],
            signCounts: [0, 1, 2, 3]
        };
        const townJSON = JSON.stringify(townObject);
        const expectedTiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.land];
        const expectedTown = Town.create(2, 2, new Vector(1, 1), TownDirection.up, new Vector(1, 0), expectedTiles, [0, 1, 2, 3]);

        const town = TownDeserializer.deserialize(townJSON);

        expect(town).toEqual(expectedTown);
    });

    it("deserializeTown - Deserializes a town from an object.", () => {
        const townObject = {
            width: 3,
            height: 2,
            karelPosition: { x: 1, y: 0 },
            karelDirection: 3,
            homePosition: { x: 2, y: 1 },
            tiles: [0, 0, 1, 1, 0, 1],
            signCounts: [0, 1, 2, 3, 4, 5]
        };
        const expectedTiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.wall, TownTile.land, TownTile.wall];
        const expectedTown = Town.create(3, 2, new Vector(1, 0), TownDirection.left, new Vector(2, 1), expectedTiles, [0, 1, 2, 3, 4, 5]);

        const town = TownDeserializer.deserializeTown(townObject);

        expect(town).toEqual(expectedTown);
    });
});
