import { Direction } from './direction';
import { MutableTown } from './mutable-town';
import { TownTile } from './town-tile';

/**
 * Karel town.
 */
export class Town {
    /**
     * Town width.
     */
    get width(): number {
        return this.mutableTown.width;
    }

    /**
     * Town height.
     */
    get height(): number {
        return this.mutableTown.height;
    }

    /**
     * Karel x coordinate.
     */
    get karelX(): number {
        return this.mutableTown.karelX;
    }

    /**
     * Karel y coordinate.
     */
    get karelY(): number {
        return this.mutableTown.karelY;
    }

    /**
     * Karel direction.
     */
    get karelDirection(): Direction {
        return this.mutableTown.karelDirection;
    }
    
    /**
     * Home x coordinate.
     */
    get homeX(): number {
        return this.mutableTown.homeX;
    }

    /**
     * Home y coordinate.
     */
    get homeY(): number {
        return this.mutableTown.homeY;
    }

    private constructor(
        private readonly mutableTown: MutableTown
    ) { }

    /**
     * Creates a new town with the specified properties.
     * @param width Town width.
     * @param height Town height.
     * @param karelX Karel x coordinate.
     * @param karelY Karel y coordinate.
     * @param karelDirection Karel direction.
     * @param homeX Home x coordinate.
     * @param homeY Home y coordinate.
     * @param tiles Tiles in row-major order.
     * @param signCounts Sign counts in row-major order.
     */
    static create(width: number, height: number, karelX: number, karelY: number, karelDirection: Direction,
        homeX: number, homeY: number, tiles: readonly TownTile[], signCounts: readonly number[]): Town {
        const mutableTown = MutableTown.create(width, height, karelX, karelY, karelDirection, homeX, homeY, tiles, signCounts);
        return new Town(mutableTown);
    }

    /**
     * Creates a new town with the specified dimensions and all tiles set to {@link TownTile.land}.
     * @param width Town width.
     * @param height Town height.
     */
    static createEmpty(width: number, height: number): Town {
        const mutableTown = MutableTown.createEmpty(width, height);
        return new Town(mutableTown);
    }

    /**
     * Returns the tile at the given coordinates.
     * @param x x coordinate.
     * @param y y coordinate.
     */
    getTileAt(x: number, y: number): TownTile {
        return this.mutableTown.getTileAt(x, y);
    }

    /**
     * Returns the number of signs at the given coordinates.
     * @param x x coordinate.
     * @param y y coordinate.
     */
    getSignCountAt(x: number, y: number): number {
        return this.mutableTown.getSignCountAt(x, y);
    }

    /**
     * Returns all tiles in row-major order.
     */
    getTiles(): readonly TownTile[] {
        return this.mutableTown.getTiles();
    }

    /**
     * Returns all sign counts in row-major order.
     * @returns 
     */
    getSignCounts(): readonly number[] {
        return this.mutableTown.getSignCounts();
    }

    /**
     * Creates a mutable version of the town.
     */
    toMutable(): MutableTown {
        return this.mutableTown.clone();
    }
}