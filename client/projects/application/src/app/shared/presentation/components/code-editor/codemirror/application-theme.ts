import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { Extension } from "@codemirror/state";

/**
 * Application Codemirror editor theme.
 */
export const applicationTheme = EditorView.baseTheme({
    "&.cm-editor": { background: "transparent", height: "100%" },
    ".cm-activeLine": { background: "none" },
    ".cm-scroller": { overflow: "auto" },
    ".cm-gutters": { background: "transparent", borderRight: "none", fontFamily: "'Roboto Mono', monospace" },
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
 * Application Codemirror style extension.
 */
export const applicationStyle: Extension = [applicationTheme];