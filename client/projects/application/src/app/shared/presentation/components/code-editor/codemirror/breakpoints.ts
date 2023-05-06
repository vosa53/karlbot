import { EditorState, StateField, StateEffect, RangeSet, TransactionSpec } from "@codemirror/state"
import { GutterMarker, EditorView, gutter, ViewUpdate } from "@codemirror/view"

/**
 * CodeMirror extension adding breakpoints support.
 */
export function breakpoints() {
    return [breakpointsField, breakpointsGutter, breakpointsTheme];
}

/**
 * Creates a transaction setting breakpoints on the given lines.
 * @param state Editor state.
 * @param breakpoints Line numbers where the breakpoints should be set. Line number starts at 1.
 */
export function setBreakpoints(state: EditorState, breakpoints: readonly number[]): TransactionSpec {
    const breakpointPositions = breakpoints.map(b => state.doc.line(b).from);
    return { effects: setBreakpointsEffect.of(breakpointPositions) };
}

/**
 * Returns from the editor line numbers where the breakpoints are. Line number starts at 1.
 * @param state Editor state.
 */
export function getBreakpoints(state: EditorState): readonly number[] {
    const breakpointPositions = state.field(breakpointsField);
    const breakpoints: number[] = [];

    const iterator = breakpointPositions.iter();
    while (iterator.value !== null) {
        const line = state.doc.lineAt(iterator.from).number;
        breakpoints.push(line);
        iterator.next();
    }

    return breakpoints;
}

/**
 * Returns whether the breakpoints changed.
 * @param viewUpdate View update.
 */
export function breakpointsChanged(viewUpdate: ViewUpdate): boolean {
    return viewUpdate.startState.field(breakpointsField) !== viewUpdate.state.field(breakpointsField);
}

const setBreakpointsEffect = StateEffect.define<number[]>({
    map: (val, mapping) => val.map(v => mapping.mapPos(v))
});

const toggleBreakpointEffect = StateEffect.define<number>({
    map: (val, mapping) => mapping.mapPos(val)
});

const breakpointsField = StateField.define<RangeSet<GutterMarker>>({
    create() { 
        return RangeSet.empty; 
    },
    update(breakpoints, transaction) {
        breakpoints = breakpoints.map(transaction.changes);

        for (const effect of transaction.effects) {
            if (effect.is(setBreakpointsEffect)) {
                const ranges = effect.value.map(v => breakpointMarker.range(v));
                breakpoints = RangeSet.of(ranges);
            }
            if (effect.is(toggleBreakpointEffect)) {
                let hasBreakpoint = false;
                breakpoints.between(effect.value, effect.value, () => { hasBreakpoint = true });
                
                if (hasBreakpoint)
                    breakpoints = breakpoints.update({ filter: (from) => from !== effect.value });
                else
                    breakpoints = breakpoints.update({ add: [breakpointMarker.range(effect.value)] });
            }
        }
        return breakpoints;
    }
})

function toggleBreakpoint(position: number): TransactionSpec {
    return { effects: toggleBreakpointEffect.of(position) };
}

const breakpointMarker = new class extends GutterMarker {
    override toDOM() { 
        return document.createTextNode("⬤");
    }
}

const breakpointsGutter = gutter({
    markers: v => v.state.field(breakpointsField),
    initialSpacer: () => breakpointMarker,
    class: "cm-breakpoints",
    domEventHandlers: {
        mousedown(view, line) {
            view.dispatch(toggleBreakpoint(line.from));
            return true;
        }
    }
});

const breakpointsTheme = EditorView.baseTheme({
    ".cm-breakpoints .cm-gutterElement": {
        color: "red",
        paddingLeft: "4px",
        cursor: "default"
    }
});
