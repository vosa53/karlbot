import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { Extension } from "@codemirror/state";

/**
 * Application Codemirror editor theme.
 */
export const applicationThemeLight = EditorView.theme({
    "&.cm-editor": { height: "100%" },
    ".cm-scroller": { overflow: "auto" },
    ".cm-gutters": { background: "transparent", borderRight: "none", fontFamily: "'Roboto Mono', monospace" },
    ".cm-content": { fontFamily: "'Roboto Mono', monospace" },
    "&.cm-focused": { outline: "none" },
    ".cm-lineNumbers": { color: "rgb(35, 120, 147)" },
    "& .cm-lineNumbers .cm-gutterElement": { paddingLeft: "8px" }
});

/**
 * Application Codemirror highlight style.
 */
export const applicationHighlightStyleLight = HighlightStyle.define([
    { tag: t.keyword, color: "#1E88E5" },
    { tag: t.operatorKeyword, color: "#673AB7" },
    { tag: t.comment, color: "#81C784" },
    { tag: t.number, color: "#AFB42B" }
]);

/**
 * Application Codemirror style extension.
 */
export const applicationStyleLight: Extension = [applicationThemeLight, syntaxHighlighting(applicationHighlightStyleLight)];