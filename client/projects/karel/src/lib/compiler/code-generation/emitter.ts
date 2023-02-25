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
import { Symbol } from "../symbols/symbol";
import { IsToken } from "../syntax-tree/tokens/is-token";

export class Emitter {
    static emit(compilation: Compilation): Assembly {
        const programSymbolToProgram = compilation.symbolTable.getDefined()
            .filter(s => s instanceof ProgramSymbol)
            .map(ps => {
                const programSymbol = <ProgramSymbol>ps;
                Emitter.throwCompilationHasErrorsIfNull(programSymbol.definition.nameToken);
                const program = new Program(programSymbol.definition.nameToken.text, [], 0);
                return <const>[ps, program];
            });

        const programSymbolToProgramMap = new Map(programSymbolToProgram);

        for (const _programSymbolToProgram of programSymbolToProgram) {
            const programSymbol = <ProgramSymbol>_programSymbolToProgram[0];
            const program = _programSymbolToProgram[1];

            const context = new EmitterContext(programSymbolToProgramMap, compilation);
            this.emitProgram(programSymbol, context);
            program.instructions.push(...context.getInstructions());
            program.variableCount = context.getVariableCount();
        }

        const programs = programSymbolToProgram.map(p => p[1]);
        return new Assembly(programs);
    }

    private static emitProgram(programSymbol: ProgramSymbol, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(programSymbol.definition.body);

        this.emitBlock(programSymbol.definition.body, context);
    }

    private static emitBlock(block: BlockNode, context: EmitterContext) {
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
    }

    private static emitCall(callNode: CallNode, context: EmitterContext) {
        const programSymbol = <ProgramSymbol | ExternalProgramSymbol>context.compilation.symbolTable.getByNode(callNode);

        if (programSymbol instanceof ProgramSymbol) {
            const program = context.getProgram(programSymbol);
            context.emit(new CallInstruction(program));
        }
        else
            context.emit(new CallExternalInstruction(programSymbol.externalProgram.name));
    }

    private static emitIf(ifNode: IfNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(ifNode.condition);
        Emitter.throwCompilationHasErrorsIfNull(ifNode.body);

        this.emitCall(ifNode.condition, context);

        const emitConditionJump = context.emitLater();

        this.emitBlock(ifNode.body, context);

        const emitOverElseJump = ifNode.elseBody !== null ? context.emitLater() : null;

        if (ifNode.operationToken instanceof IsToken)
            emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
        else
            emitConditionJump(new JumpIfTrueInstruction(context.nextInstructionIndex));

        if (ifNode.elseBody !== null) {
            this.emitBlock(ifNode.elseBody, context);
            emitOverElseJump!(new JumpInstruction(context.nextInstructionIndex));
        }
    }

    private static emitWhile(whileNode: WhileNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(whileNode.condition);
        Emitter.throwCompilationHasErrorsIfNull(whileNode.body);

        const conditionInstructionIndex = context.nextInstructionIndex;

        this.emitCall(whileNode.condition, context);

        const emitConditionJump = context.emitLater();

        this.emitBlock(whileNode.body, context);

        context.emit(new JumpInstruction(conditionInstructionIndex));

        if (whileNode.operationToken instanceof IsToken)
            emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
        else
            emitConditionJump(new JumpIfTrueInstruction(context.nextInstructionIndex));
    }

    private static emitRepeat(repeatNode: RepeatNode, context: EmitterContext) {
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.countToken);
        Emitter.throwCompilationHasErrorsIfNull(repeatNode.body);

        const indexVariable = context.createVariable();

        context.emit(new PushInstruction(0));
        context.emit(new StoreInstruction(indexVariable));

        const conditionInstructionIndex = context.nextInstructionIndex;

        const count = parseInt(repeatNode.countToken.text);
        context.emit(new PushInstruction(count));
        context.emit(new LoadInstruction(indexVariable));
        context.emit(new CompareGreaterInstruction());

        const emitConditionJump = context.emitLater();

        this.emitBlock(repeatNode.body, context);

        context.emit(new PushInstruction(1));
        context.emit(new LoadInstruction(indexVariable));
        context.emit(new AddInstruction());
        context.emit(new StoreInstruction(indexVariable));

        context.emit(new JumpInstruction(conditionInstructionIndex));

        emitConditionJump(new JumpIfFalseInstruction(context.nextInstructionIndex));
    }

    private static throwCompilationHasErrorsIfNull<T>(value: T | null): asserts value is T {
        if (value === null)
            throw new Error("Can not emit a compilation that contains errors.");
    }
}

class EmitterContext {
    get nextInstructionIndex(): number {
        return this.instructions.length;
    }

    createVariable(): number {
        return this.variableCount++;
    }

    getProgram(programSymbol: ProgramSymbol): Program {
        const program = this.programSymbolToProgramMap.get(programSymbol);
        if (program === undefined)
            throw new Error("Program for this symbol was not found.");

        return program;
    }

    emit(instruction: Instruction) {
        this.instructions.push(instruction);
    }

    emitLater(): (instruction: Instruction) => void {
        const index = this.instructions.length;
        this.instructions.push(null);

        this.laterEmitsCount++;

        return (instruction) => {
            if (this.instructions[index] !== null)
                throw new Error("This emit was already used.");

            this.laterEmitsCount--;
            this.instructions[index] = instruction;
        };
    }

    getInstructions(): Instruction[] {
        if (this.laterEmitsCount !== 0)
            throw new Error("Can not get instructons before all later emits are done.");

        return <Instruction[]>this.instructions;
    }

    getVariableCount(): number {
        return this.variableCount;
    }

    private variableCount = 0;
    private readonly instructions: (Instruction | null)[] = [];
    private laterEmitsCount = 0;

    constructor(private readonly programSymbolToProgramMap: Map<Symbol, Program>,
        readonly compilation: Compilation) {
    }
}