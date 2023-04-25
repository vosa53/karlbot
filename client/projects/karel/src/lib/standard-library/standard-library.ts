import { DataType } from "../compiler/data-type";
import { ExternalProgramReference } from "../compiler/external-program-reference";
import { ExternalProgram } from "../interpreter/external-program";
import { MutableTown } from "../town/town";
import * as standardLibraryProgramHandlers from "./standard-library-program-handlers";

/**
 * Karel standard library.
 */
export class StandardLibrary {
    /**
     * Returns standard library program references.
     */
    static getProgramReferences(): ExternalProgramReference[] {
        return [
            new ExternalProgramReference("step", DataType.unit),
            new ExternalProgramReference("turnLeft", DataType.unit),
            new ExternalProgramReference("pick", DataType.unit),
            new ExternalProgramReference("put", DataType.unit),
            new ExternalProgramReference("wall", DataType.number),
            new ExternalProgramReference("sign", DataType.number),
            new ExternalProgramReference("north", DataType.number),
            new ExternalProgramReference("south", DataType.number),
            new ExternalProgramReference("east", DataType.number),
            new ExternalProgramReference("west", DataType.number),
            new ExternalProgramReference("home", DataType.number)
        ];
    }
    
    /**
     * Returns standard library programs.
     * @param town Town where the programs should be executed.
     * @param actionDelayProvider Provider function of a delay for town actions.
     */
    static getPrograms(town: MutableTown, actionDelayProvider: () => number): ExternalProgram[] {
        return [
            new ExternalProgram("step", st => standardLibraryProgramHandlers.step(town, actionDelayProvider(), st)),
            new ExternalProgram("turnLeft", st => standardLibraryProgramHandlers.turnLeft(town, actionDelayProvider(), st)),
            new ExternalProgram("pick", st => standardLibraryProgramHandlers.pick(town, actionDelayProvider(), st)),
            new ExternalProgram("put", st => standardLibraryProgramHandlers.put(town, actionDelayProvider(), st)),
            new ExternalProgram("wall", st => this.booleanToNumber(standardLibraryProgramHandlers.wall(town))),
            new ExternalProgram("sign", st => this.booleanToNumber(standardLibraryProgramHandlers.sign(town))),
            new ExternalProgram("north", st => this.booleanToNumber(standardLibraryProgramHandlers.north(town))),
            new ExternalProgram("south", st => this.booleanToNumber(standardLibraryProgramHandlers.south(town))),
            new ExternalProgram("east", st => this.booleanToNumber(standardLibraryProgramHandlers.east(town))),
            new ExternalProgram("west", st => this.booleanToNumber(standardLibraryProgramHandlers.west(town))),
            new ExternalProgram("home", st => this.booleanToNumber(standardLibraryProgramHandlers.isHome(town)))
        ];
    }

    private static booleanToNumber(value: boolean): number {
        return value ? 1 : 0;
    }
}