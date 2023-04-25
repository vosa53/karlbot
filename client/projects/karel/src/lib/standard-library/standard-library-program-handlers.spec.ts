import { ExternalProgramException } from "../interpreter/external-program-exception";
import { InterpretStopToken } from "../interpreter/interpret-stop-token";
import { Vector } from "../math/vector";
import { MutableTown } from "../town/town";
import { TownDirection } from "../town/town-direction";
import { pick, put, step, turnLeft } from "./standard-library-program-handlers";

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
});