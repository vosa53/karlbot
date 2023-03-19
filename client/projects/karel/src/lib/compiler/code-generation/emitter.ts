import { Assembly } from "../../assembly/assembly";
import { AddInstruction } from "../../assembly/instructions/add-instruction";
import { CallExternalInstruction } from "../../assembly/instructions/call-external-instruction";
import { CallInstruction } from "../../assembly/instructions/call-instruction";
import { CompareGreaterInstruction } from "../../assembly/instructions/compare-greater-instruction";
import { Instruction } from "../../assembly/instructions/instruction";
import { JumpIfFalseInstruction } from "../../assembly/instructions/jump-if-false-instruction";
import { JumpIfTrueInstruction } from "../../assembly/instructions/jump-if-true-instruction";
import { JumpInstruction } from "../../assembly/instructions/jump-instruction";
import { LoadInstruction } from "../../assembly/instructions/load-instruction";
import { PushInstruction } from "../../assembly/instructions/push-instruction";
import { StoreInstruction } from "../../assembly/instructions/store-instruction";
import { Program } from "../../assembly/program";
import { Compilation } from "../compilation";
import { BlockNode } from "../syntax-tree/nodes/block-node";
import { CallNode } from "../syntax-tree/nodes/call-node";
import { IfNode } from "../syntax-tree/nodes/if-node";
import { RepeatNode } from "../syntax-tree/nodes/repeat-node";
import { WhileNode } from "../syntax-tree/nodes/while-node";
import { ExternalProgramSymbol } from "../symbols/external-program-symbol";
import { ProgramSymbol } from "../symbols/program-symbol";
import { IsToken } from "../syntax-tree/tokens/is-token";
import { FileLineTextRange, SourceMap } from "../../assembly/source-map";
import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { NoOperationInstruction } from "../../assembly/instructions/no-operation-instruction";
import { ProgramNode } from "../syntax-tree/nodes/program-node";
import { LineTextRange } from "../../text/line-text-range";

/**
 * Generates instructions.
 */
export class Emitter {
    /**
     * Creates an assembly from the given compilation.
     * @param compilation Compilation.
     */
    static emit(compilation: Compilation): Assembly {
        const programs: Program[] = [];
        const instructionToSourceRange: [Instruction, FileLineTextRange][] = [];

        for (const symbol of compilation.symbolTable.getDefined()) {
            if (!(symbol instanceof ProgramSymbol))
                continue;

            const programNode = symbol.definition;
            Emitter.throwCompilationHasErrorsIfNull(programNode.nameToken);
            const compilationUnitNode = programNode.parent as CompilationUnitNode;
            
            const emitterContext = new EmitterContext(compilation);
            this.emitProgram(programNode, emitterContext);
            const instructionsWithSourceRanges = emitterContext.getInstructionsWithSourceRanges();
            const instructions = instructionsWithSourceRanges.map(iwsr => iwsr[0]);
            const variableCount = emitterContext.getVariableCount();

            for (const [instruction, sourceRange] of instructionsWithSourceRanges) {
                const sourceRangeWithFile = new FileLineTextRange(compilationUnitNode.filePath, sourceRange);
                instructionToSourceRange.push([instruction, sourceRangeWithFile]);
            }
            
            const program = new Program(programNode.nameToken.text, instructions, variableCount);
            programs.push(program);
        }

        const sourceMap = SourceMap.create(instructionToSourceRange);
        return new Assembly(programs, sourceMap);
    }

    private static emitProgram(program: ProgramNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(program.programToken);
        Emitter.throwCompilationHasErrorsIfNull(program.nameToken);
        Emitter.throwCompilationHasErrorsIfNull(program.body);

        const programSourceRange = program.programToken.getLineTextRangeWithoutTrivia();
        const nameSourceRange = program.nameToken.getLineTextRangeWithoutTrivia();
        const sourceRange = new LineTextRange(
            programSourceRange.startLine, programSourceRange.startColumn, 
            nameSourceRange.endLine, nameSourceRange.endColumn
        );

        context.emit(new NoOperationInstruction(), sourceRange);

        this.emitBlock(program.body, context);
    }

    private static emitBlock(block: BlockNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(block.endToken);

        for (const statement of block.statements) {
            if (statement instanceof CallNode)
                this.emitCall(statement, context);
            else if (statement instanceof IfNode)
                this.emitIf(statement, context);
            else if (statement instanceof WhileNode)
                this.emitWhile(statement, context);
            else if (statement instanceof RepeatNode)
                this.emitRepeat(statement, context);
            else
                throw new Error();
        }

        const endSourceRange = block.endToken.getLineTextRangeWithoutTrivia();
        context.emit(new NoOperationInstruction(), endSourceRange);
    }

    private static emitCall(callNode: CallNode, context: EmitterContext, sourceRange?: LineTextRange) {
        sourceRange = sourceRange ?? callNode.getLineTextRangeWithoutTrivia();

        const programSymbol = context.compilation.symbolTable.getByNode(callNode) as ProgramSymbol | ExternalProgramSymbol;
        if (programSymbol instanceof ProgramSymbol) {
            Emitter.throwCompilationHasErrorsIfNull(programSymbol.definition.nameToken);
            context.emit(new CallInstruction(programSymbol.definition.nameToken.text), sourceRange);
        }
        else
            context.emit(new CallExternalInstruction(programSymbol.externalProgram.name), sourceRange);
    }

    private static emitIf(ifNode: IfNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(ifNode.ifToken);
        Emitter.throwCompilationHasErrorsIfNull(ifNode.condition);
        Emitter.throwCompilationHasErrorsIfNull(ifNode.body);

        const ifSourceRange = ifNode.ifToken.getLineTextRangeWithoutTrivia();
        const conditionSourceRange = ifNode.condition.getLineTextRangeWithoutTrivia();
        const sourceRange = new LineTextRange(
            ifSourceRange.startLine, ifSourceRange.startColumn, 
            conditionSourceRange.endLine, conditionSourceRange.endColumn
        );

        this.emitCall(ifNode.condition, context, sourceRange);

        const emitConditionJump = context.emitLater(sourceRange);

        this.emitBlock(ifNode.body, context);

        const emitOverElseJump = ifNode.elseBody !== null ? context.emitLater(sourceRange) : null;

        if (ifNode.operationToken instanceof IsToken)
            emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
        else
            emitConditionJump(new JumpIfTrueInstruction(context.nextInstructionIndex));

        if (ifNode.elseBody !== null) {
            const elseSourceRange = ifNode.elseToken!.getLineTextRangeWithoutTrivia();

            context.emit(new NoOperationInstruction(), elseSourceRange);
            this.emitBlock(ifNode.elseBody, context);
            emitOverElseJump!(new JumpInstruction(context.nextInstructionIndex));
        }
    }

    private static emitWhile(whileNode: WhileNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(whileNode.whileToken);
        Emitter.throwCompilationHasErrorsIfNull(whileNode.condition);
        Emitter.throwCompilationHasErrorsIfNull(whileNode.body);

        const whileSourceRange = whileNode.whileToken.getLineTextRangeWithoutTrivia();
        const conditionSourceRange = whileNode.condition.getLineTextRangeWithoutTrivia();
        const sourceRange = new LineTextRange(
            whileSourceRange.startLine, whileSourceRange.startColumn, 
            conditionSourceRange.endLine, conditionSourceRange.endColumn
        );

        const conditionInstructionIndex = context.nextInstructionIndex;

        this.emitCall(whileNode.condition, context, sourceRange);

        const emitConditionJump = context.emitLater(sourceRange);

        this.emitBlock(whileNode.body, context);

        context.emit(new JumpInstruction(conditionInstructionIndex), sourceRange);

        if (whileNode.operationToken instanceof IsToken)
            emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
        else
            emitConditionJump(new JumpIfTrueInstruction(context.nextInstructionIndex));
    }

    private static emitRepeat(repeatNode: RepeatNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.repeatToken);
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.countToken);
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.timesToken);
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.body);

        const repeatSourceRange = repeatNode.repeatToken.getLineTextRangeWithoutTrivia();
        const timesSourceRange = repeatNode.timesToken.getLineTextRangeWithoutTrivia();
        const sourceRange = new LineTextRange(
            repeatSourceRange.startLine, repeatSourceRange.startColumn, 
            timesSourceRange.endLine, timesSourceRange.endColumn
        );

        const indexVariable = context.createVariable();

        context.emit(new PushInstruction(0), sourceRange);
        context.emit(new StoreInstruction(indexVariable), sourceRange);

        const conditionInstructionIndex = context.nextInstructionIndex;

        const count = parseInt(repeatNode.countToken.text);
        context.emit(new PushInstruction(count), sourceRange);
        context.emit(new LoadInstruction(indexVariable), sourceRange);
        context.emit(new CompareGreaterInstruction(), sourceRange);

        const emitConditionJump = context.emitLater(sourceRange);

        this.emitBlock(repeatNode.body, context);

        context.emit(new PushInstruction(1), sourceRange);
        context.emit(new LoadInstruction(indexVariable), sourceRange);
        context.emit(new AddInstruction(), sourceRange);
        context.emit(new StoreInstruction(indexVariable), sourceRange);

        context.emit(new JumpInstruction(conditionInstructionIndex), sourceRange);

        emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
    }

    private static throwCompilationHasErrorsIfNull<T>(value: T | null): asserts value is T {
        if (value === null)
            throw new Error("Can not emit a compilation that contains errors.");
    }
}

/**
 * Used to emit instructions in a single program.
 */
class EmitterContext {
    /**
     * Index of the next emitted instruction.
     */
    get nextInstructionIndex(): number {
        return this.instruction.length;
    }

    /**
     * Emits a single instruction.
     * @param instruction Instruction to emit.
     * @param sourceRange Text range that represents the instruction in the source code.
     */
    emit(instruction: Instruction, sourceRange: LineTextRange) {
        this.instruction.push([instruction, sourceRange]);
    }

    /**
     * Creates a function to emit an instruction in the current place and returns it. The function can be used only once.
     * @param sourceRange Text range that represents the instruction in the source code.
     */
    emitLater(sourceRange: LineTextRange): (instruction: Instruction) => void {
        const index = this.instruction.length;
        this.instruction.push([null, sourceRange]);

        this.laterEmitsCount++;

        return (instruction) => {
            if (this.instruction[index][0] !== null)
                throw new Error("This emitLater function was already used.");

            this.laterEmitsCount--;
            this.instruction[index][0] = instruction;
        };
    }

    /**
     * Creates a new variable and returns its index.
     */
    createVariable(): number {
        return this.variableCount++;
    }

    /**
     * Returns the emitted instructions with the text range that represents them in the source code.
     * Can not be used before all later emits with {@link emitLater} are done.
     */
    getInstructionsWithSourceRanges(): [Instruction, LineTextRange][] {
        if (this.laterEmitsCount !== 0)
            throw new Error("Can not get instructons before all later emits are done.");

        return this.instruction as [Instruction, LineTextRange][];
    }

    /**
     * Returns the number of created variables.
     */
    getVariableCount(): number {
        return this.variableCount;
    }

    private readonly instruction: [Instruction | null, LineTextRange][] = [];
    private variableCount = 0;
    private laterEmitsCount = 0;

    /**
     * @param compilation Compilation.
     */
    constructor(readonly compilation: Compilation) { }
}