import { EvaluationError } from "./evaluation-error";

export function assert(condition: boolean, errorMessage?: string): asserts condition is true {
    if (!condition)
        throw new EvaluationError(errorMessage);
}