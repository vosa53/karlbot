import { EditorView, Decoration, DecorationSet } from "@codemirror/view"
import { StateField, StateEffect, TransactionSpec, EditorState } from "@codemirror/state"
import { LineTextRange } from "karel";

// Inspired from: https://codemirror.net/examples/decoration/.

/**
 * CodeMirror extension highlighting a specified code range. For example to highlight the currently executed instruction.
 */
export function currentRangeHighlighting() {
    return [currentRangeField, currentRangeTheme];
}

/**
 * Creates a transaction to highlight the given code range.
 * @param state Editor state.
 * @param currentRange Code range to be highlighted.
 */
export function setCurrentRange(state: EditorState, currentRange: LineTextRange | null): TransactionSpec {
    if (currentRange === null)
        return { effects: setCurrentRangeEffect.of(null) };
    
    const from = state.doc.line(currentRange.startLine).from + currentRange.startColumn - 1;
    const to = state.doc.line(currentRange.endLine).from + currentRange.endColumn - 1;
    return { effects: setCurrentRangeEffect.of({ from, to }) };
}

const setCurrentRangeEffect = StateEffect.define<{ from: number, to: number } | null>({
    map: (value, change) => {
        if (value === null)
            return null;
        else
            return { from: change.mapPos(value.from), to: change.mapPos(value.to) };
    }
});

const currentRangeField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none
    },
    update(currentRange, transaction) {
        currentRange = currentRange.map(transaction.changes);

        for (const effect of transaction.effects) {
            if (!effect.is(setCurrentRangeEffect))
                continue;

            if (effect.value === null)
                currentRange = Decoration.none;
            else
                currentRange = Decoration.set(currentRangeMark.range(effect.value.from, effect.value.to));
        }
        return currentRange;
    },
    provide: currentRange => EditorView.decorations.from(currentRange)
});

const currentRangeMark = Decoration.mark({ class: "cm-current-range" });

const currentRangeTheme = EditorView.baseTheme({
    "&light .cm-current-range": { background: "#FDD83566", outline: "solid 1px #FDD83566" },
    "&dark .cm-current-range": { background: "#C0CA3366", outline: "solid 1px #C0CA3366" }
});
