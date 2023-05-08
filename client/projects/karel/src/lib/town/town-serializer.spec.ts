import { Vector } from "../math/vector";
import { Town } from "./town";
import { TownDirection } from "./town-direction";
import { TownSerializer } from "./town-serializer";
import { TownTile } from "./town-tile";

describe("TownDeserialzer", () => {
    it("serialize - Serializes a town to a JSON.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.land];
        const town = Town.create(2, 2, new Vector(1, 1), TownDirection.up, new Vector(1, 0), tiles, [0, 1, 2, 3]);
        const expectedTownObject = {
            width: 2,
            height: 2,
            karelPosition: { x: 1, y: 1 },
            karelDirection: 0,
            homePosition: { x: 1, y: 0 },
            tiles: [0, 0, 1, 0],
            signCounts: [0, 1, 2, 3]
        };
        const expectedTownJSON = JSON.stringify(expectedTownObject);

        const townJSON = TownSerializer.serialize(town);

        expect(townJSON).toEqual(expectedTownJSON);
    });

    it("serializeTown - Serializes a town to an object.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.wall, TownTile.land, TownTile.wall];
        const town = Town.create(3, 2, new Vector(1, 0), TownDirection.left, new Vector(2, 1), tiles, [0, 1, 2, 3, 4, 5]);
        const expectedTownObject = {
            width: 3,
            height: 2,
            karelPosition: { x: 1, y: 0 },
            karelDirection: 3,
            homePosition: { x: 2, y: 1 },
            tiles: [0, 0, 1, 1, 0, 1],
            signCounts: [0, 1, 2, 3, 4, 5]
        };

        const townObject = TownSerializer.serializeTown(town);

        expect(townObject).toEqual(expectedTownObject);
    });
});
