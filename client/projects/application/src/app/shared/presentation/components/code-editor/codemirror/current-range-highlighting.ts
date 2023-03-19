import { EditorView, Decoration, DecorationSet } from "@codemirror/view"
import { StateField, StateEffect, TransactionSpec, EditorState } from "@codemirror/state"
import { LineTextRange } from "projects/karel/src/public-api";

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
    ".cm-current-range": { background: "rgba(252, 215, 3, 0.5)" }
});

export function setCurrentRange(state: EditorState, currentRange: LineTextRange | null): TransactionSpec {
    if (currentRange === null)
        return { effects: setCurrentRangeEffect.of(null) };
    
    const from = state.doc.line(currentRange.startLine).from + currentRange.startColumn - 1;
    const to = state.doc.line(currentRange.endLine).from + currentRange.endColumn - 1;
    return { effects: setCurrentRangeEffect.of({ from, to }) };
}

export function currentRangeHighlighting() {
    return [currentRangeField, currentRangeTheme];
}
