import { Exception } from "../exception";

/**
 * Interpret result expressing that intepretation ended by an exception.
 */
export class ExceptionInterpretResult {
    /**
     * Exception.
     */
    readonly exception: Exception;

    /**
     * @param exception Exception.
     */
    constructor(exception: Exception) {
        this.exception = exception;
    }
}