import { LineTextRange } from "../text/line-text-range";
import { Instruction } from "./instructions/instruction"

/**
 * Maps instructions to text ranges that represents them in the source code and vice versa. 
 */
export class SourceMap {
    private constructor(
        private readonly instructionToRange: ReadonlyMap<Instruction, FileLineTextRange>,

        // Better would be a a single map with a composite key (fileName, line), but JavaScript does not support it.
        private readonly fileToLineToInstructions: ReadonlyMap<string, ReadonlyMap<number, readonly Instruction[]>>
    ) { }

    /**
     * Creates a new source map.
     * @param instructionsWithRange Array of pairs mapping each instruction to a text range that represents it in the source code.
     */
    static create(instructionsWithRange: readonly (readonly [Instruction, FileLineTextRange])[]) {
        const instructionsWithRangeSortedByPosition = [...instructionsWithRange];
        instructionsWithRangeSortedByPosition.sort((a, b) => {
            const aRange = a[1].textRange;
            const bRange = b[1].textRange;
            if (aRange.startLine > bRange.startLine) return 1;
            if (aRange.startLine < bRange.startLine) return -1;
            if (aRange.startLine > bRange.startColumn) return 1;
            if (aRange.startLine < bRange.startColumn) return -1;
            return 0;
        });

        const instructionToRange = new Map<Instruction, FileLineTextRange>();
        const fileToLineToInstructions = new Map<string, Map<number, Instruction[]>>();

        for (const [instruction, range] of instructionsWithRange) {
            if (instructionToRange.has(instruction))
                throw new Error("Instruction was specified more than once.");

            instructionToRange.set(instruction, range);

            let lineToInstructions = fileToLineToInstructions.get(range.filePath);
            if (lineToInstructions === undefined) {
                lineToInstructions = new Map<number, Instruction[]>();
                fileToLineToInstructions.set(range.filePath, lineToInstructions);
            }

            for (let line = range.textRange.startLine; line <= range.textRange.endLine; line++) {
                let instructions = lineToInstructions.get(line);
                if (instructions === undefined) {
                    instructions = [];
                    lineToInstructions.set(line, instructions);
                }
                instructions.push(instruction);
            }
        }

        return new SourceMap(instructionToRange, fileToLineToInstructions);
    }

    /**
     * Returns a range that represents the given instruction it in the source code.
     * @param instruction Instruction.
     */
    getRangeByInstruction(instruction: Instruction): FileLineTextRange {
        const range = this.instructionToRange.get(instruction);
        if (range === undefined)
            throw new Error("Unknown instruction.");
        
        return range;
    }

    /**
     * Returns all instructions whose source code text range is fully or partially on the given line in the given file. 
     * Instructions are sorted in ascending order by the start position of their text range.
     * @param filePath File path.
     * @param line Line number. First is 1.
     */
    getInstructionsByLine(filePath: string, line: number): readonly Instruction[] {
        return this.fileToLineToInstructions.get(filePath)?.get(line) ?? [];
    }
}

/**
 * {@link LineTextRange} with a file path information.
 */
export class FileLineTextRange {
    /**
     * File path.
     */
    readonly filePath: string;

    /**
     * Text range.
     */
    readonly textRange: LineTextRange;

    /**
     * @param filePath File path.
     * @param textRange Text range.
     */
    constructor(filePath: string, textRange: LineTextRange) {
        this.filePath = filePath;
        this.textRange = textRange;
    }

    /**
     * Returns `true` when this and other are equal. `false` otherwise.
     * @param other Other.
     */
    equals(other: FileLineTextRange): boolean {
        return this.filePath  === other.filePath && this.textRange.equals(other.textRange);
    }
}