import { LineTextRange } from "../text/line-text-range";
import { Instruction } from "./instructions/instruction";
import { FileLineTextRange, SourceMap } from "./source-map";

describe("SourceMap", () => {
    it("create - Throws an error when a single instruction is specified more than once.", () => {
        const instruction = new TestInstruction();
        const instructions: [Instruction, FileLineTextRange][] = [
            [instruction, new FileLineTextRange("file1", new LineTextRange(4, 1, 5, 3))],
            [instruction, new FileLineTextRange("file2", new LineTextRange(10, 5, 10, 12))]
        ];
        
        expect(() => SourceMap.create(instructions)).toThrowError();
    });

    it("getRangeByInstruction - Returns a range of the given instruction when the instruction is known.", () => {
        const instruction1 = new TestInstruction();
        const instruction2 = new TestInstruction();
        const sourceMap = SourceMap.create([
            [instruction1, new FileLineTextRange("file1", new LineTextRange(4, 1, 5, 3))],
            [instruction2, new FileLineTextRange("file2", new LineTextRange(10, 5, 10, 12))]
        ]);

        const range = sourceMap.getRangeByInstruction(instruction2);

        expect(range).toEqual(new FileLineTextRange("file2", new LineTextRange(10, 5, 10, 12)));
    });

    it("getRangeByInstruction - Throws an error when the instruction is not known.", () => {
        const sourceMap = SourceMap.create([
            [new TestInstruction(), new FileLineTextRange("file", new LineTextRange(4, 1, 5, 3))],
        ]);

        expect(() => sourceMap.getRangeByInstruction(new TestInstruction())).toThrowError();
    });

    it("getInstructionsByLine - Returns all instuctions on the given line", () => {
        const instruction1 = new TestInstruction();
        const instruction2 = new TestInstruction();
        const instruction3 = new TestInstruction();
        const instruction4 = new TestInstruction();
        const sourceMap = SourceMap.create([
            [instruction1, new FileLineTextRange("file", new LineTextRange(1, 1, 1, 8))],
            [instruction2, new FileLineTextRange("file", new LineTextRange(4, 1, 4, 3))],
            [instruction3, new FileLineTextRange("file", new LineTextRange(4, 6, 4, 9))]
        ]);

        const instructions = sourceMap.getInstructionsByLine("file", 4);

        expect(instructions).toEqual([instruction2, instruction3]);
    });

    it("getInstructionsByLine - Returns only instructions from the given file", () => {
        const instruction1 = new TestInstruction();
        const instruction2 = new TestInstruction();
        const sourceMap = SourceMap.create([
            [instruction1, new FileLineTextRange("file1", new LineTextRange(4, 1, 4, 3))],
            [instruction2, new FileLineTextRange("file2", new LineTextRange(4, 1, 4, 3))],
        ]);

        const instructions = sourceMap.getInstructionsByLine("file2", 4);

        expect(instructions).toEqual([instruction2]);
    });

    it("getInstructionsByLine - Instructions are returned in order of their starting position.", () => {
        const instruction1 = new TestInstruction();
        const instruction2 = new TestInstruction();
        const instruction3 = new TestInstruction();
        const sourceMap = SourceMap.create([
            [instruction3, new FileLineTextRange("file", new LineTextRange(5, 20, 7, 8))],
            [instruction1, new FileLineTextRange("file", new LineTextRange(2, 10, 5, 3))],
            [instruction2, new FileLineTextRange("file", new LineTextRange(5, 6, 5, 15))]
        ]);

        const instructions = sourceMap.getInstructionsByLine("file", 5);

        expect(instructions).toEqual([instruction1, instruction2, instruction3]);
    });
});

class TestInstruction extends Instruction {
    private static nextId = 0;

    // Every instance should have a unique data.
    private readonly id = TestInstruction.nextId++;
}