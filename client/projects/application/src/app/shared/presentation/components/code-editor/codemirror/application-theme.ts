import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

/**
 * Application CodeMirror editor theme.
 */
export const applicationTheme = EditorView.baseTheme({
    "&.cm-editor": { background: "transparent", height: "100%" },
    ".cm-gutters": { borderRight: "none", fontFamily: "'Roboto Mono', monospace" },
    ".cm-activeLine": { background: "none" },
    ".cm-scroller": { overflow: "auto" },
    ".cm-content": { fontFamily: "'Roboto Mono', monospace" },
    "&.cm-focused": { outline: "none" },
    "& .cm-lineNumbers .cm-gutterElement": { paddingLeft: "8px" },
    "& .cm-activeLine": { outline: "2px solid white" },
    "& .cm-activeLineGutter": { background: "none" },
    ".cm-tooltip, .cm-tooltip.cm-tooltip-autocomplete, .cm-tooltip.cm-completionInfo": { borderRadius: "4px", border: "none" },
    ".cm-tooltip-autocomplete > ul > li": { display: "flex", alignItems: "center", height: "28px", fontSize: "15px" },
    ".cm-tooltip-autocomplete > ul > li:first-child": { borderTopLeftRadius: "4px", borderTopRightRadius: "4px" },
    ".cm-tooltip-autocomplete > ul > li:last-child": { borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px" },
    ".cm-tooltip-autocomplete .cm-completionLabel": { flexGrow: "1" },
    ".cm-tooltip-autocomplete .cm-completionMatchedText": { textDecoration: "none" },
    ".cm-tooltip-autocomplete .cm-completionDetail": { fontStyle: "normal", opacity: 0.6, paddingRight: "4px" }
});

/**
 * Application CodeMirror style extension.
 */
export const applicationStyle: Extension = [applicationTheme];