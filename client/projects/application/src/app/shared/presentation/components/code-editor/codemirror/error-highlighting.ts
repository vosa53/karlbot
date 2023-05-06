import { TransactionSpec, EditorState } from "@codemirror/state";
import { Error } from "karel";
import { Diagnostic, setDiagnostics } from "@codemirror/lint"

/**
 * Creates a transaction highlighting the given errors in the source code.
 * @param state Editor state.
 * @param errors Errors to be highlighted.
 */
export function setErrors(state: EditorState, errors: readonly Error[]): TransactionSpec {
    const diagnostics: Diagnostic[] = errors.map(e => {
        const from = state.doc.line(e.textRange.startLine).from + e.textRange.startColumn - 1;
        const to = state.doc.line(e.textRange.endLine).from + e.textRange.endColumn - 1;
        return {
            from,
            to,
            severity: "error",
            message: e.message
        };
    });

    return setDiagnostics(state, diagnostics);
}