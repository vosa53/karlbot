import { Program } from './program';
import { SourceMap } from './source-map';

/**
 * Assembly.
 */
export class Assembly {
    /**
     * Programs in the assembly.
     */
    readonly programs: readonly Program[];

    /**
     * Source map.
     */
    readonly sourceMap: SourceMap;

    /**
     * @param programs Programs in the assembly.
     * @param sourceMap Source map.
     */
    constructor(programs: readonly Program[], sourceMap: SourceMap) {
        this.programs = programs;
        this.sourceMap = sourceMap;
    }
}