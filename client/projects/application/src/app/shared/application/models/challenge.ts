export interface Challenge {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly evaluationCode: string | null;
}