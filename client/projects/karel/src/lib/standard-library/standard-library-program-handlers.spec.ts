import { ExternalProgramException } from "../interpreter/external-program-exception";
import { InterpretStopToken } from "../interpreter/interpret-stop-token";
import { Vector } from "../math/vector";
import { MutableTown } from "../town/town";
import { TownDirection } from "../town/town-direction";
import { TownTile } from "../town/town-tile";
import { east, home, north, pick, put, sign, south, step, turnLeft, wall, west } from "./standard-library-program-handlers";

describe("Standard library program handlers", () => {
    it("step - Moves Karel one tile in the direction he is looking.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(1, 1);
        town.karelDirection = TownDirection.left;

        const result = await step(town, 0, new InterpretStopToken());

        expect(result).toBeUndefined();
        expect(town.karelPosition).toEqual(new Vector(0, 1));
    });

    it("step - Returns exception when there is a wall before Karel.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(2, 0);
        town.karelDirection = TownDirection.up;

        const result = await step(town, 0, new InterpretStopToken());

        expect(result).toBeInstanceOf(ExternalProgramException)
        expect(town.karelPosition).toEqual(new Vector(2, 0));
    });

    it("turnLeft - Turns Karel 90 degrees left.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.right as TownDirection;

        const result = await turnLeft(town, 0, new InterpretStopToken());

        expect(result).toBeUndefined();
        expect(town.karelDirection).toEqual(TownDirection.up);
    });

    it("pick - Picks one sign from the tile where the Karel is.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(2, 1);
        town.setSignCountAt(2, 1, 7);

        const result = await pick(town, 0, new InterpretStopToken());

        expect(result).toBeUndefined();
        expect(town.getSignCountAt(2, 1)).toEqual(6);
    });

    it("pick - Returns exception when there is no sign to pick.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(1, 1);

        const result = await pick(town, 0, new InterpretStopToken());

        expect(result).toBeInstanceOf(ExternalProgramException);
    });

    it("put - Puts one sign on the tile where the Karel is.", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(2, 1);
        town.setSignCountAt(2, 1, 4);

        const result = await put(town, 0, new InterpretStopToken());

        expect(result).toBeUndefined();
        expect(town.getSignCountAt(2, 1)).toEqual(5);
    });

    it("put - Returns exception when there is already a maximum number of signs (8).", async () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelPosition = new Vector(1, 1);
        town.setSignCountAt(1, 1, 8);

        const result = await put(town, 0, new InterpretStopToken());

        expect(result).toBeInstanceOf(ExternalProgramException);
        expect(town.getSignCountAt(1, 1)).toEqual(8);
    });

    it("wall - Returns true when there is a wall in front of Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.setTileAt(1, 0, TownTile.wall);

        expect(wall(town)).toBeTrue();
    });

    it("wall - Returns false when there is not a wall in front of Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(wall(town)).toBeFalse();
    });

    it("sign - Returns true when there is a sign on the tile with Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.setSignCountAt(0, 0, 5);

        expect(sign(town)).toBeTrue();
    });

    it("sign - Returns false when there is not a sign on the tile with Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(sign(town)).toBeFalse();
    });

    it("home - Returns true when there is a home on the tile with Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(home(town)).toBeTrue();
    });

    it("home - Returns false when there is not a home on the tile with Karel.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.homePosition = new Vector(1, 1);

        expect(home(town)).toBeFalse();
    });

    it("north - Returns true when Karel is facing north.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.up;

        expect(north(town)).toBeTrue();
    });

    it("north - Returns false when Karel is not facing north.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.left;

        expect(north(town)).toBeFalse();
    });

    it("south - Returns true when Karel is facing south.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.down;

        expect(south(town)).toBeTrue();
    });

    it("south - Returns false when Karel is not facing south.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.right;

        expect(south(town)).toBeFalse();
    });

    it("west - Returns true when Karel is facing west.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.left;

        expect(west(town)).toBeTrue();
    });

    it("west - Returns false when Karel is not facing west.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.up;

        expect(west(town)).toBeFalse();
    });

    it("east - Returns true when Karel is facing east.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.right;

        expect(east(town)).toBeTrue();
    });

    it("east - Returns false when Karel is not facing east.", () => {
        const town = MutableTown.createEmpty(5, 5);
        town.karelDirection = TownDirection.left;

        expect(east(town)).toBeFalse();
    });
});