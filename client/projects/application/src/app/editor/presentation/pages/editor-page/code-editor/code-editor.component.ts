import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { karel } from "./codemirror/karel-codemirror-language";
import { applicationStyle } from "./codemirror/application-codemirror-style";
import { linter, Diagnostic, setDiagnostics } from "@codemirror/lint"
import { autocompletion, Completion } from "@codemirror/autocomplete";
import { Error } from "projects/karel/src/lib/compiler/errors/error";
import { CompletionItem } from "projects/karel/src/lib/compiler/language-service/completion-item";
import { CompletionItemType } from "projects/karel/src/lib/compiler/language-service/completion-item-type";


@Component({
    selector: "app-code-editor",
    templateUrl: "./code-editor.component.html",
    styleUrls: ["./code-editor.component.css"]
})
export class CodeEditorComponent implements AfterViewInit {
    @Input()
    get code(): string {
        return this._code;
    }

    set code(value: string) {
        if (this._code === value)
            return;

        this._code = value;
        if (this.editorView !== null && this.codeInEditor !== value) {
            this.editorView.dispatch({ changes: { from: 0, to: this.editorView.state.doc.length, insert: value } });
            this.codeInEditor = value;
        }
    }

    @Input()
    get errors(): readonly Error[] {
        return this._errors;
    }

    set errors(value: readonly Error[]) {
        this._errors = value;
        this.updateDiagnostics();
    }

    @Input()
    completionItemsProvider: (line: number, column: number) => CompletionItem[] = (l, c) => [];

    @Output()
    codeChange = new EventEmitter<string>();

    private _code = "";
    private codeInEditor = "";
    private _errors: readonly Error[] = [];
    private editorView: EditorView | null = null;

    constructor(private readonly hostElement: ElementRef) {

    }

    onCodeChange(newCode: string) {
        this.codeChange.emit(newCode);
    }

    ngAfterViewInit(): void {
        this.editorView = new EditorView({
            doc: this._code,
            extensions: [
                keymap.of(defaultKeymap),
                basicSetup,
                applicationStyle,
                karel(),
                EditorView.updateListener.of(u => {
                    if (!u.docChanged)
                        return;
                    
                    this.codeInEditor = u.state.doc.toString();
                    this.codeChange.emit(this.codeInEditor);
                }),
                autocompletion({
                    override: [
                        c => {
                            const identifier = c.matchBefore(/[a-zA-Z][a-zA-Z0-9]*/);
                            if (identifier === null)
                                return null;
                            if (identifier.from == identifier.to && !c.explicit)
                                return null

                            const line = c.state.doc.lineAt(c.pos);
                            const lineNumber = line.number;
                            const columnNumber = c.pos - line.from + 1;
                            const completionItems = this.completionItemsProvider(lineNumber, columnNumber);
                            const codemirrorCompletionItems: Completion[] = completionItems.map(ci => {
                                return {
                                    label: ci.text,
                                    detail: ci.description,
                                    info: ci.title,
                                    type: ci.type === CompletionItemType.program ? "program" : "externalProgram"
                                };
                            });
                            return {
                                from: identifier.from,
                                options: codemirrorCompletionItems
                            };
                        }
                    ]
                })
                //indentUnit.of("  ")
            ],
            parent: this.hostElement.nativeElement.children[0]
        });
        this.codeInEditor = this.code;
        this.updateDiagnostics();
    }

    private updateDiagnostics() {
        if (this.editorView === null)
            return;

        const diagnostics: Diagnostic[] = this.errors.map(e => {
            const from = this.editorView!.state.doc.line(e.textRange.startLine).from + e.textRange.startColumn - 1;
            const to = this.editorView!.state.doc.line(e.textRange.endLine).from + e.textRange.endColumn - 1;
            return {
                from,
                to,
                severity: "error",
                message: e.message
            };
        });
        this.editorView!.dispatch(setDiagnostics(this.editorView!.state, diagnostics));
    }
}
