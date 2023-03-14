import { Vector } from '../math/vector';
import { TownDirection } from './town-direction';
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


/**
 * Karel town.
 * 
 * Mutable version.
 */
export class MutableTown {
    /**
     * Maximum number of signs on one tile.
     */
    static readonly MAX_SIGN_COUNT = 8;

    /**
     * Town width.
     */
    get width(): number {
        return this._width;
    }

    /**
     * Town height.
     */
    get height(): number {
        return this._height;
    }

    /**
     * Karel position.
     */
    get karelPosition(): Vector {
        return this._karelPosition;
    }

    set karelPosition(value: Vector) {
        MutableTown.throwIfInvalidCoordinates(value.x, value.y, this.width, this.height);
        this._karelPosition = value;
    }

    /**
     * Karel direction.
     */
    karelDirection: TownDirection;
    
    /**
     * Home position.
     */
    get homePosition(): Vector {
        return this._homePosition;
    }

    set homePosition(value: Vector) {
        MutableTown.throwIfInvalidCoordinates(value.x, value.y, this.width, this.height);
        this._homePosition = value;
    }

    private _width: number;
    private _height: number;
    private _karelPosition: Vector;
    private _homePosition: Vector;
    private signCounts: number[];
    private tiles: TownTile[];

    private constructor(width: number, height: number, karelPosition: Vector, karelDirection: TownDirection, homePosition: Vector, 
        tiles: TownTile[], signCounts: number[]) {
        this._width = width;
        this._height = height;
        this._karelPosition = karelPosition;
        this.karelDirection = karelDirection;
        this._homePosition = homePosition;
        this.tiles = tiles;
        this.signCounts = signCounts;
    }

    /**
     * Creates a new town with the specified properties.
     * @param width Town width.
     * @param height Town height.
     * @param karelPosition Karel position.
     * @param karelDirection Karel direction.
     * @param homePosition Home position.
     * @param tiles Tiles in row-major order.
     * @param signCounts Sign counts in row-major order.
     */
    static create(width: number, height: number, karelPosition: Vector, karelDirection: TownDirection, homePosition: Vector,
        tiles: readonly TownTile[], signCounts: readonly number[]): MutableTown {
        MutableTown.throwIfInvalidSize(width);
        MutableTown.throwIfInvalidSize(height);
        MutableTown.throwIfInvalidCoordinates(karelPosition.x, karelPosition.y, width, height);
        MutableTown.throwIfInvalidCoordinates(homePosition.x, homePosition.y, width, height);
        
        for (const signCount of signCounts)
            MutableTown.throwIfInvalidSignCount(signCount);
        
        const tileCount = width * height;
        if (tiles.length !== tileCount)
            throw new Error("Length of tiles is not equal to width * height.");
        if (signCounts.length !== tileCount)
            throw new Error("Length of sign counts is not equal to width * height.");

        return new MutableTown(width, height, karelPosition, karelDirection, homePosition, [...tiles], [...signCounts]);
    }

    /**
     * Creates a new town with the specified dimensions and all tiles set to {@link TownTile.land}.
     * @param width Town width.
     * @param height Town height.
     */
    static createEmpty(width: number, height: number): MutableTown {
        MutableTown.throwIfInvalidSize(width);
        MutableTown.throwIfInvalidSize(height);
        
        const tileCount = width * height;

        const tiles = new Array<number>(tileCount);
        const signCounts = new Array<number>(tileCount);

        tiles.fill(0);
        signCounts.fill(TownTile.land);

        return new MutableTown(width, height, Vector.ZERO, TownDirection.right, Vector.ZERO, tiles, signCounts);
    }

    /**
     * Creates a deep copy of the town. Does not copy immutable properties.
     */
    clone(): MutableTown {
        return new MutableTown(
            this.width,
            this.height,
            this.karelPosition,
            this.karelDirection,
            this.homePosition,
            [...this.tiles],
            [...this.signCounts]
        );
    }

    /**
     * Resizes the town.
     * @param newWidth New width.
     * @param newHeight New height.
     */
    resize(newWidth: number, newHeight: number) {
        MutableTown.throwIfInvalidSize(newWidth);
        MutableTown.throwIfInvalidSize(newHeight);

        const tileCount = newWidth * newHeight;

        const newTiles: TownTile[] = new Array(tileCount);
        const newSignCounts: number[] = new Array(tileCount);

        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (x < this.width && y < this.height) {
                    newTiles[y * newWidth + x] = this.tiles[y * this.width + x];
                    newSignCounts[y * newWidth + x] = this.signCounts[y * this.width + x];
                }
                else {
                    newTiles[y * newWidth + x] = TownTile.land;
                    newSignCounts[y * newWidth + x] = 0;
                }
            }
        }

        this._width = newWidth;
        this._height = newHeight;
        this._karelPosition = new Vector(
            Math.min(newWidth - 1, this.karelPosition.x),
            Math.min(newHeight - 1, this.karelPosition.y)
        );
        this._homePosition = new Vector(
            Math.min(newWidth - 1, this.homePosition.x),
            Math.min(newHeight - 1, this.homePosition.y)
        );
        this.tiles = newTiles;
        this.signCounts = newSignCounts;
    }

    /**
     * Returns the tile at the given coordinates.
     * @param x x coordinate.
     * @param y y coordinate.
     */
    getTileAt(x: number, y: number): TownTile {
        MutableTown.throwIfInvalidCoordinates(x, y, this.width, this.height);
        return this.tiles[this.convert2DTo1D(x, y)];
    }

    /**
     * Sets a tile at the given coordinates.
     * @param x x coordinate,
     * @param y y coordinate.
     * @param tile Tile to be set.
     */
    setTileAt(x: number, y: number, tile: TownTile) {
        MutableTown.throwIfInvalidCoordinates(x, y, this.width, this.height);
        this.tiles[this.convert2DTo1D(x, y)] = tile;
    }

    /**
     * Returns the number of signs at the given coordinates.
     * @param x x coordinate.
     * @param y y coordinate.
     */
    getSignCountAt(x: number, y: number): number {
        MutableTown.throwIfInvalidCoordinates(x, y, this.width, this.height);
        return this.signCounts[this.convert2DTo1D(x, y)];
    }

    /**
     * Sets a number of signs at the given coordinates.
     * @param x x coordinate.
     * @param y y coordinate.
     * @param signCount Sign count to be set.
     */
    setSignCountAt(x: number, y: number, signCount: number) {
        MutableTown.throwIfInvalidCoordinates(x, y, this.width, this.height);
        MutableTown.throwIfInvalidSignCount(signCount);
        this.signCounts[this.convert2DTo1D(x, y)] = signCount;
    }

    /**
     * Returns all tiles in row-major order.
     */
    getTiles(): readonly TownTile[] {
        return this.tiles;
    }

    /**
     * Returns all sign counts in row-major order.
     * @returns 
     */
    getSignCounts(): readonly number[] {
        return this.signCounts;
    }

    /**
     * Creates an immutable version of the town.
     */
    toImmutable(): Town {
        return Town.create(this.width, this.height, this.karelPosition, this.karelDirection, this.homePosition, this.tiles, this.signCounts);
    }

    private convert2DTo1D(x: number, y: number): number {
        return y * this.width + x;
    }

    private static throwIfInvalidSignCount(signCount: number) {
        if (signCount < 0 || signCount > MutableTown.MAX_SIGN_COUNT)
            throw new Error(`Sign count must be greater than or equal to 0 and less than ${MutableTown.MAX_SIGN_COUNT}.`);
    }

    private static throwIfInvalidCoordinates(x: number, y: number, townWidth: number, townHeight: number) {
        if (x < 0 || x >= townWidth || y < 0 || y >= townHeight)
            throw new Error("Coordinates are outside of the town.");
    }

    private static throwIfInvalidSize(size: number) {
        if (size <= 0)
            throw new Error("Size must be a positive number.");
    }
}

/**
 * Karel town.
 * 
 * Readonly version.
 */
export type ReadonlyTown = Town | MutableTown; // TODO: Implement as an interface.
