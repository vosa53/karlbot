import { ExceptionInterpretResult } from "./exception-interpret-result";
import { NormalInterpretResult } from "./normal-interpret-result";
import { StopInterpretResult } from "./stop-interpret-result";

/**
 * Result of an interpretation.
 */
export type InterpretResult = NormalInterpretResult | StopInterpretResult | ExceptionInterpretResult;