/**
 * Text range defined with line and column numbers.
 */
export class LineTextRange {
    /**
     * Start line number of the text range. First is 1.
     */
    readonly startLine: number;

    /**
     * Start column number of the text range. First is 1.
     */
    readonly startColumn: number;

    /**
     * End line number of the text range. First is 1.
     */
    readonly endLine: number;

    /**
     * End column number of the text range. First is 1.
     */
    readonly endColumn: number;

    /**
     * @param startLine Start line number of the text range. First is 1.
     * @param startColumn Start column number of the text range. First is 1.
     * @param endLine End line number of the text range. First is 1.
     * @param endColumn End column number of the text range. First is 1.
     */
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number) {
        this.startLine = startLine;
        this.startColumn = startColumn;
        this.endLine = endLine;
        this.endColumn = endColumn;
    }

    /**
     * Returns `true` when this and other are equal. `false` otherwise.
     * @param other Other.
     */
    equals(other: LineTextRange): boolean {
        return this.startLine  === other.startLine && this.startColumn === other.startColumn && 
            this.endLine === other.endLine && this.endColumn === other.endColumn;
    }
}