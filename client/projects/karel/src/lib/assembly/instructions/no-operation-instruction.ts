import { Instruction } from './instruction';

/**
 * Instruction to fill space. For example to allow breakpoints to be set on some source code range that is not executable and so does not have any corresponsing instructions.
 */
export class NoOperationInstruction extends Instruction {

}