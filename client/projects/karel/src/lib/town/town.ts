import { Vector } from '../math/vector';
import { TownDirection } from './town-direction';
import { MutableTown } from './mutable-town';
import { TownTile } from './town-tile';

/**
 * Karel town.
 */
export class Town {
    /**
     * Maximum number of signs on one tile.
     */
    static get MAX_SIGN_COUNT(): number {
        return MutableTown.MAX_SIGN_COUNT;
    }
    
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
     * Karel position.
     */
    get karelPosition(): Vector {
        return this.mutableTown.karelPosition;
    }

    /**
     * Karel direction.
     */
    get karelDirection(): TownDirection {
        return this.mutableTown.karelDirection;
    }
    
    /**
     * Home position.
     */
    get homePosition(): Vector {
        return this.mutableTown.homePosition;
    }

    private constructor(
        private readonly mutableTown: MutableTown
    ) { }

    /**
     * Creates a new town with the specified properties.
     * @param width Town width.
     * @param height Town height.
     * @param karelPosition Karel position
     * @param karelDirection Karel direction.
     * @param homePosition Home position.
     * @param tiles Tiles in row-major order.
     * @param signCounts Sign counts in row-major order.
     */
    static create(width: number, height: number, karelPosition: Vector, karelDirection: TownDirection, homePosition: Vector,
        tiles: readonly TownTile[], signCounts: readonly number[]): Town {
        const mutableTown = MutableTown.create(width, height, karelPosition, karelDirection, homePosition, tiles, signCounts);
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