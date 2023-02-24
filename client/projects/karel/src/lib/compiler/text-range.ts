export class TextRange {
    readonly position: number;
    readonly length: number;

    constructor(position: number, length: number) {
        this.position = position;
        this.length = length;
    }
}