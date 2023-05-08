import { Vector } from "../math/vector";
import { MutableTown } from "./town";
import { TownDirection } from "./town-direction";
import { TownTile } from "./town-tile";

describe("MutableTown", () => {
    it("create - Creates a new town.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.land, TownTile.wall, TownTile.land, TownTile.wall];
        const signCounts = [0, 1, 2, 3, 4, 5];
        const town = MutableTown.create(3, 2, new Vector(0, 1), TownDirection.left, new Vector(0, 0), tiles, signCounts);

        expect(town.width).toBe(3);
        expect(town.height).toBe(2);
        expect(town.karelPosition).toEqual(new Vector(0, 1));
        expect(town.karelDirection).toBe(TownDirection.left);
        expect(town.homePosition).toEqual(new Vector(0, 0));
        expect(town.getTiles()).toEqual(tiles);
        expect(town.getSignCounts()).toEqual(signCounts);
    });

    it("create - Throws an error when the town is invalid.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.land];
        const signCounts = [0, 1, 2, 3];

        expect(() => MutableTown.create(-2, -2, Vector.ZERO, TownDirection.left, Vector.ZERO, tiles, signCounts)).toThrowError();
        expect(() => MutableTown.create(3, 2, Vector.ZERO, TownDirection.left, Vector.ZERO, tiles, signCounts)).toThrowError();
        expect(() => MutableTown.create(2, 2, new Vector(2, 0), TownDirection.left, Vector.ZERO, tiles, signCounts)).toThrowError();
        expect(() => MutableTown.create(2, 2, Vector.ZERO, TownDirection.left, new Vector(2, 0), tiles, signCounts)).toThrowError();
    });

    it("createEmpty - Creates a new empty town.", () => {
        const town = MutableTown.createEmpty(1, 2);

        expect(town.width).toBe(1);
        expect(town.height).toBe(2);
        expect(town.karelPosition).toEqual(new Vector(0, 0));
        expect(town.karelDirection).toBe(TownDirection.right);
        expect(town.homePosition).toEqual(new Vector(0, 0));
        expect(town.getTiles()).toEqual([TownTile.land, TownTile.land]);
        expect(town.getSignCounts()).toEqual([0, 0]);
    });

    it("createEmpty - Throws an error when the town size is invalid.", () => {
        expect(() => MutableTown.createEmpty(2, -1)).toThrowError();
    });

    it("getTileAt - Returns a tile at the given position.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.wall];
        const signCounts = [0, 1, 2, 3];
        const town = MutableTown.create(2, 2, Vector.ZERO, TownDirection.left, Vector.ZERO, tiles, signCounts);

        const tile = town.getTileAt(0, 1);

        expect(tile).toBe(TownTile.wall);
    });

    it("getSignCountAt - Returns a sign count at the given position.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.wall, TownTile.wall];
        const signCounts = [0, 1, 2, 3];
        const town = MutableTown.create(2, 2, Vector.ZERO, TownDirection.left, Vector.ZERO, tiles, signCounts);

        const signCount = town.getSignCountAt(0, 1);

        expect(signCount).toBe(2);
    });

    it("setTileAt - Sets a tile at the given position.", () => {
        const town = MutableTown.createEmpty(2, 2);

        town.setTileAt(1, 0, TownTile.wall);

        expect(town.getTileAt(1, 0)).toBe(TownTile.wall);
    });

    it("setTileAt - Throws an error when the position is outside of the town.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(() => town.setTileAt(5, 2, TownTile.wall)).toThrowError();
        expect(() => town.setTileAt(-3, 2, TownTile.wall)).toThrowError();
    });

    it("setSignCountAt - Sets a sign count at the given position.", () => {
        const town = MutableTown.createEmpty(2, 2);

        town.setSignCountAt(1, 0, 7);

        expect(town.getSignCountAt(1, 0)).toBe(7);
    });

    it("setTileAt - Throws an error when the position is outside of the town.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(() => town.setSignCountAt(5, 2, 5)).toThrowError();
        expect(() => town.setSignCountAt(-3, 2, 6)).toThrowError();
    });

    it("setTileAt - Throws an error when the sign count is greater than 8.", () => {
        const town = MutableTown.createEmpty(5, 5);

        expect(() => town.setSignCountAt(3, 1, 9)).toThrowError();
    });

    it("clone - The old town and the new town must be independent.", () => {
        const oldTown = MutableTown.createEmpty(2, 2);

        const newTown = oldTown.clone();
        oldTown.karelPosition = new Vector(1, 1);
        oldTown.setTileAt(1, 0, TownTile.wall);
        oldTown.setSignCountAt(0, 1, 5);

        expect(newTown.karelPosition).toEqual(Vector.ZERO);
        expect(newTown.getTileAt(1, 0)).toBe(TownTile.land);
        expect(newTown.getSignCountAt(0, 1)).toBe(0);
    });

    it("assign - The 'from' town and the 'to' town must be independent.", () => {
        const tiles = [TownTile.land, TownTile.land, TownTile.land, TownTile.wall, TownTile.land, TownTile.wall];
        const signCounts = [0, 1, 2, 3, 4, 5];
        const fromTown = MutableTown.create(3, 2, new Vector(0, 1), TownDirection.left, new Vector(0, 0), tiles, signCounts);
        const toTown = MutableTown.createEmpty(2, 1);

        toTown.assign(fromTown);
        fromTown.karelPosition = new Vector(1, 1);
        fromTown.setTileAt(1, 0, TownTile.wall);
        fromTown.setSignCountAt(0, 1, 7);

        expect(toTown.karelPosition).toEqual(new Vector(0, 1));
        expect(toTown.getTileAt(1, 0)).toBe(TownTile.land);
        expect(toTown.getSignCountAt(0, 1)).toBe(3);
    });

    it("resize - Crops the town.", () => {
        const town = MutableTown.createEmpty(10, 10);
        town.setTileAt(2, 3, TownTile.wall);
        town.setTileAt(8, 6, TownTile.wall);
        const expected = MutableTown.createEmpty(5, 5);
        expected.setTileAt(2, 3, TownTile.wall);
        
        town.resize(5, 5);

        expect(town).toEqual(expected);
    });

    it("resize - Clamps positions of Karel and its home.", () => {
        const town = MutableTown.createEmpty(10, 10);
        town.karelPosition = new Vector(8, 3);
        town.homePosition = new Vector(1, 6);
        
        town.resize(5, 5);

        expect(town.karelPosition).toEqual(new Vector(4, 3));
        expect(town.homePosition).toEqual(new Vector(1, 4));
    });

    it("changed - Is called when the town is changed.", () => {
        let callCount = 0;
        const town = MutableTown.createEmpty(10, 10);
        town.changed.addListener(() => callCount++);
        
        town.setTileAt(7, 6, TownTile.wall);
        expect(callCount).toBe(1);
        town.setSignCountAt(7, 6, 5);
        expect(callCount).toBe(2);
        town.resize(5, 5);
        expect(callCount).toBe(3);
        town.karelPosition = new Vector(2, 4);
        expect(callCount).toBe(4);
        town.karelDirection = TownDirection.down;
        expect(callCount).toBe(5);
        town.homePosition = new Vector(2, 4);
        expect(callCount).toBe(6);
    });
});
