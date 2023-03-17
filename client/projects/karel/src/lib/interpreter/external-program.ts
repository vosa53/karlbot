import { ExternalProgramException } from './external-program-exception';
import { InterpretStopToken } from './interpret-stop-token'

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
export type ExternalProgramHandler = (stopToken: InterpretStopToken) => 
    void | number | ExternalProgramException | Promise<void | number | ExternalProgramException>;