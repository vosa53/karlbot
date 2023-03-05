import { Exception } from './exception';
import { InterpretStopToken } from './interpret-stop-token';
import { Interpreter } from './interpreter';

/**
 * External program.
 */
export class ExternalProgram {
    /**
     * Name.
     */
    readonly name: string;

    /**
     * Handler.
     */
    readonly handler: ExternalProgramHandler;

    /**
     * @param name Name.
     * @param handler Handler.
     */
    constructor(name: string, handler: ExternalProgramHandler) {
        this.name = name;
        this.handler = handler;
    }
}

/**
 * External program handler.
 */
export type ExternalProgramHandler = (interpreter: Interpreter, stopToken: InterpretStopToken) => 
    void | number | Exception | Promise<void | number | Exception>;