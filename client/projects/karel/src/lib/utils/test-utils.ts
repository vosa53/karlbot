/**
 * Utils for tests.
 */
export class TestUtils {
    /**
     * Ajusts a multi-line string indentation relative to the indentation of the second line and trims the first and the last line.
     * @param text Text to dedent.
     * @example
     * Input:
     * ```
     * 
     *   aa
     *     bb
     * 
     * ```
     * Output:
     * ```
     * aa
     *   bb
     * ```
     */
    static dedent(text: string) {
        const lines = text.split("\n");
        lines.splice(0, 1);
        lines.pop();
        const indentationLength = lines[0].match(/^[ ]*/)?.[0].length ?? 0;
        return lines.map(l => l.substring(indentationLength)).join("\n");
    }
}