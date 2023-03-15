import { CallStackFrame, Checker, Emitter, ExceptionInterpretResult, Interpreter, InterpretStopToken, MutableTown, Project, StandardLibrary } from "karel";
import { EvaluationError } from "./evaluation-error";

export async function run(project: Project, town: MutableTown): Promise<void> {
    const errors = Checker.check(project.compilation);
    if (errors.length !== 0)
        throw new EvaluationError("Project contains errors.");

    const assembly = Emitter.emit(project.compilation);
    const interpreter = new Interpreter();

    const externalPrograms = StandardLibrary.getPrograms(town, () => 0);
    for (const externalProgram of externalPrograms)
        interpreter.addExternalProgram(externalProgram);

    const entryPoint = assembly.programs.find(p => p.name === project.settings.entryPoint);
    if (entryPoint === undefined)
        throw new EvaluationError("No valid entry point is selected.");

    interpreter.callStack.push(new CallStackFrame(entryPoint));

    const result = await interpreter.interpretAll(new InterpretStopToken());

    if (result instanceof ExceptionInterpretResult)
        throw new EvaluationError("Exception was thrown: " + result.exception.message);
}