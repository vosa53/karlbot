export class EvaluationResult {
    readonly successRate: number;
    readonly message: string;

    constructor(successRate: number, message: string) {
        this.successRate = successRate;
        this.message = message;
    }
}