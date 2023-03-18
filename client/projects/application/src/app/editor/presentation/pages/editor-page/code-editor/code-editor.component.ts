import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { karel } from "./codemirror/karel-language";
import { applicationStyleLight } from "./codemirror/application-theme-light";
import { linter, Diagnostic, setDiagnostics } from "@codemirror/lint"
import { autocompletion, Completion } from "@codemirror/autocomplete";
import { Error } from "projects/karel/src/lib/compiler/errors/error";
import { CompletionItem } from "projects/karel/src/lib/compiler/language-service/completion-item";
import { CompletionItemType } from "projects/karel/src/lib/compiler/language-service/completion-item-type";
import { CommonModule } from "@angular/common";
import { LineTextRange } from "projects/karel/src/public-api";
import { Decoration, DecorationSet } from "@codemirror/view"
import { StateField, StateEffect } from "@codemirror/state"
import { codeCompletion } from "./codemirror/code-completion";
import { setErrors } from "./codemirror/error-highlighting";
import { currentRangeHighlighting, setCurrentRange } from "./codemirror/current-range-highlighting";


@Component({
    standalone: true,
    selector: "app-code-editor",
    imports: [CommonModule],
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
    get currentRange(): LineTextRange | null {
        return this._currentRange;
    }

    set currentRange(value: LineTextRange | null) {
        this._currentRange = value;
        this.updateCurrentRange();
    }

    @Input()
    completionItemsProvider: (line: number, column: number) => CompletionItem[] = (l, c) => [];

    @Output()
    codeChange = new EventEmitter<string>();

    private _code = "";
    private codeInEditor = "";
    private _errors: readonly Error[] = [];
    private _currentRange: LineTextRange | null = null;
    private editorView: EditorView | null = null;

    constructor(private readonly hostElement: ElementRef) {

    }

    ngAfterViewInit(): void {
        this.editorView = new EditorView({
            doc: this._code,
            extensions: [
                currentRangeHighlighting(),
                keymap.of(defaultKeymap),
                basicSetup,
                applicationStyleLight,
                karel(),
                codeCompletion((line, column) => this.completionItemsProvider(line, column)),
                EditorView.updateListener.of(u => this.onEditorViewUpdate(u))
                //indentUnit.of("  ")
            ],
            parent: this.hostElement.nativeElement.children[0]
        });
        this.codeInEditor = this.code;
        this.updateDiagnostics();
        this.updateCurrentRange();
    }

    private onEditorViewUpdate(update: ViewUpdate) {
        if (!update.docChanged)
            return;

        this.codeInEditor = update.state.doc.toString();
        this.codeChange.emit(this.codeInEditor);
    }

    private updateDiagnostics() {
        if (this.editorView !== null)
            this.editorView.dispatch(setErrors(this.editorView.state, this.errors));
    }

    private updateCurrentRange() {
        if (this.editorView !== null)
            this.editorView.dispatch(setCurrentRange(this.editorView.state, this.currentRange));
    }
}
