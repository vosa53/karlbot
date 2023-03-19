import { TransactionSpec, EditorState } from "@codemirror/state";
import { Error } from "projects/karel/src/public-api";
import { Diagnostic, setDiagnostics } from "@codemirror/lint"

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