import { parser } from "./lezer/karel-parser";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage, LanguageSupport, continuedIndent, indentNodeProp } from "@codemirror/language";

/**
 * Karel codemirror language.
 */
export const karelLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                identifier: t.variableName,
                SingleLineComment: t.lineComment,
                MultiLineComment: t.blockComment,
                Number: t.number,
                "program if else while repeat times end": t.controlKeyword,
                Operator: t.operatorKeyword,
            }),
            indentNodeProp.add({
                Program: continuedIndent(),
                If: continuedIndent({ except: /^else\b/ }),
                While: continuedIndent(),
                Repeat: continuedIndent()
            })
        ]
    })
});

/**
 * Codemirror language support for Karel.
 */
export function karel() {
    return new LanguageSupport(karelLanguage);
}