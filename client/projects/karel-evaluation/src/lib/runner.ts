import { CallStackFrame, Emitter, Interpreter, InterpretStopToken, MutableTown, Project, StandardLibrary } from "karel";

export class Runner {
    static async run(project: Project, town: MutableTown): Promise<void> {
        const assembly = Emitter.emit(project.compilation);
        const interpreter = new Interpreter();

        const externalPrograms = StandardLibrary.getPrograms(town, () => 0);
        for (const externalProgram of externalPrograms)
            interpreter.addExternalProgram(externalProgram);

        const entryPoint = assembly.programs.find(p => p.name === project.settings.entryPoint)!;
        interpreter.callStack.push(new CallStackFrame(entryPoint));
        await interpreter.interpretAll(new InterpretStopToken());
    }
}