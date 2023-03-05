/**
 * Settings.
 */
export class Settings {
    /**
     * Entry point.
     */
    readonly entryPoint: string;

    /**
     * Karel speed.
     */
    readonly karelSpeed: number;

    /**
     * Max recursion depth.
     */
    readonly maxRecursionDepth: number;

    /**
     * @param entryPoint Entry point.
     * @param karelSpeed Karel speed.
     * @param maxRecursionDepth Max recursion depth.
     */
    constructor(entryPoint: string, karelSpeed: number, maxRecursionDepth: number) {
        this.entryPoint = entryPoint;
        this.karelSpeed = karelSpeed;
        this.maxRecursionDepth = maxRecursionDepth;
    }

    /**
     * Creates a new settings with replaced entry point.
     * @param entryPoint A new entry point.
     */
    withEntryPoint(entryPoint: string): Settings {
        return new Settings(entryPoint, this.karelSpeed, this.maxRecursionDepth);
    }

    /**
     * Creates a new settings with replaced Karel speed.
     * @param karelSpeed A new Karel speed.
     */
    withKarelSpeed(karelSpeed: number): Settings {
        return new Settings(this.entryPoint, karelSpeed, this.maxRecursionDepth);
    }

    /**
     * Creates a new settings with replaced max recursion depth.
     * @param maxRecursionDepth A new max recursion depth.
     */
    withMaxRecursionDepth(maxRecursionDepth: number): Settings {
        return new Settings(this.entryPoint, this.karelSpeed, maxRecursionDepth);
    }
}