/**
 * Text range defined with string index and length.
 */
export class TextRange {
    /**
     * Start position of the text range. First is 0.
     */
    readonly position: number;

    /**
     * The text range length.
     */
    readonly length: number;

    /**
     * @param position Start position of the text range. Starts at 0.
     * @param length The text range length.
     */
    constructor(position: number, length: number) {
        this.position = position;
        this.length = length;
    }

    /**
     * Returns `true` when this and other are equal. `false` otherwise.
     * @param other Other.
     */
    equals(other: TextRange): boolean {
        return this.position  === other.position && this.length === other.length;
    }
}