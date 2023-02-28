import { Direction } from './direction';
import { Town } from './town';
import { TownTile } from './town-tile';

/**
 * Karel town.
 * 
 * Mutable version.
 */
export class MutableTown {
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
     * Karel x coordinate.
     */
    get karelX(): number {
        return this._karelX;
    }

    set karelX(value: number) {
        MutableTown.throwIfInvalidXCoordinate(value, this.width);
        this._karelX = value;
    }

    /**
     * Karel y coordinate.
     */
    get karelY(): number {
        return this._karelY;
    }

    set karelY(value: number) {
        MutableTown.throwIfInvalidYCoordinate(value, this.height);
        this._karelY = value;
    }

    /**
     * Karel direction.
     */
    karelDirection: Direction;
    
    /**
     * Home x coordinate.
     */
    get homeX(): number {
        return this._homeX;
    }

    set homeX(value: number) {
        MutableTown.throwIfInvalidXCoordinate(value, this.width);
        this._homeX = value;
    }

    /**
     * Home y coordinate.
     */
    get homeY(): number {
        return this._homeY;
    }

    set homeY(value: number) {
        MutableTown.throwIfInvalidYCoordinate(value, this.height);
        this._homeY = value;
    }

    private static readonly MAX_SIGN_COUNT = 8;

    private _width: number;
    private _height: number;
    private _karelX: number;
    private _karelY: number;
    private _homeX: number;
    private _homeY: number;
    private signCounts: number[];
    private tiles: TownTile[];

    private constructor(width: number, height: number, karelX: number, karelY: number, karelDirection: Direction,
        homeX: number, homeY: number, tiles: TownTile[], signCounts: number[]) {
        this._width = width;
        this._height = height;
        this._karelX = karelX;
        this._karelY = karelY;
        this.karelDirection = karelDirection;
        this._homeX = homeX;
        this._homeY = homeY;
        this.tiles = tiles;
        this.signCounts = signCounts;
    }

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
        homeX: number, homeY: number, tiles: readonly TownTile[], signCounts: readonly number[]): MutableTown {
        MutableTown.throwIfInvalidSize(width);
        MutableTown.throwIfInvalidSize(height);
        MutableTown.throwIfInvalidCoordinates(karelX, karelY, width, height);
        MutableTown.throwIfInvalidCoordinates(homeX, homeY, width, height);
        
        for (const signCount of signCounts)
            MutableTown.throwIfInvalidSignCount(signCount);
        
        const tileCount = width * height;
        if (tiles.length !== tileCount)
            throw new Error("Length of tiles is not equal to width * height.");
        if (signCounts.length !== tileCount)
            throw new Error("Length of sign counts is not equal to width * height.");

        return new MutableTown(width, height, karelX, karelY, karelDirection, homeX, homeY, [...tiles], [...signCounts]);
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

        return new MutableTown(width, height, 0, 0, Direction.left, 0, 0, tiles, signCounts);
    }

    /**
     * Creates a deep copy of the town.
     */
    clone(): MutableTown {
        return new MutableTown(
            this.width,
            this.height,
            this.karelX,
            this.karelY,
            this.karelDirection,
            this.homeX,
            this.homeY,
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
        this.tiles = newTiles;
        this.signCounts = newSignCounts;
        this._karelX = Math.min(newWidth - 1, this.karelX);
        this._karelY = Math.min(newHeight - 1, this.karelY);
        this._homeX = Math.min(newWidth - 1, this.homeX);
        this._homeY = Math.min(newHeight - 1, this.homeY);
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
        return Town.create(this.width, this.height, this.karelX, this.karelY, this.karelDirection, this.homeX, this.homeY, this.tiles, this.signCounts);
    }

    private convert2DTo1D(x: number, y: number): number {
        return y * this.width + x;
    }

    private static throwIfInvalidSignCount(signCount: number) {
        if (signCount < 0 || signCount > MutableTown.MAX_SIGN_COUNT)
            throw new Error(`Sign count must be greater than or equal to 0 and less than ${MutableTown.MAX_SIGN_COUNT}.`);
    }

    private static throwIfInvalidCoordinates(x: number, y: number, townWidth: number, townHeight: number) {
        this.throwIfInvalidXCoordinate(x, townWidth);
        this.throwIfInvalidXCoordinate(y, townHeight);
    }

    private static throwIfInvalidXCoordinate(x: number, townWidth: number) {
        if (x < 0 || x >= townWidth)
            throw new Error("x coordinate has to be greater than or equal to 0 and less than the town width.");
    }

    private static throwIfInvalidYCoordinate(y: number, townHeight: number) {
        if (y < 0 || y >= townHeight)
            throw new Error("y coordinate has to be greater than or equal to 0 and less than the town height.");
    }

    private static throwIfInvalidSize(size: number) {
        if (size <= 0)
            throw new Error("Size must be a positive number.");
    }
}