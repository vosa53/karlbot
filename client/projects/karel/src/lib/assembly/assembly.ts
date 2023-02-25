import { Program } from './program';

/**
 * Assembly.
 */
export class Assembly {
    /**
     * Programs in the assembly.
     */
    readonly programs: readonly Program[];

    /**
     * @param programs Programs in the assembly.
     */
    constructor(programs: readonly Program[]) {
        this.programs = programs;
    }
}