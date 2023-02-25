import { Program } from './program';

export class Assembly {
    readonly programs: Program[];

    constructor(programs: Program[]) {
        this.programs = programs;
    }
}