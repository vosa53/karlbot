/**
 * Result of evaluation.
 */
export class EvaluationResult {
    /**
     * Success ratio. Must be between 0 and 1.
     */
    readonly successRate: number;

    /**
     * Message further descripting the result.
     */
    readonly message: string;

    /**
     * @param successRate Success ratio. Must be between 0 and 1.
     * @param message Message further descripting the result.
     */
    constructor(successRate: number, message: string) {
        this.successRate = successRate;
        this.message = message;
    }
}