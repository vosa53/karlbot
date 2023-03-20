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
import { Compartment } from "@codemirror/state"
import { codeCompletion } from "./codemirror/code-completion";
import { setErrors } from "./codemirror/error-highlighting";
import { currentRangeHighlighting, setCurrentRange } from "./codemirror/current-range-highlighting";
import { breakpoints, breakpointsChanged, getBreakpoints, setBreakpoints } from "./codemirror/breakpoints";
import { applicationStyle } from "./codemirror/application-theme";
import { applicationStyleDark } from "./codemirror/application-theme-dark";
import { tabKeymap } from "./codemirror/tab-keymap";
import { ColorTheme, ColorThemeService } from "../../../application/services/color-theme.service";


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
        this._code = value;
        this.updateCode();
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
    get breakpoints(): readonly number[] {
        return this._breakpoints;
    }

    set breakpoints(value: readonly number[]) {
        this._breakpoints = value;
        this.updateBreakpoints();
    }

    @Input()
    completionItemsProvider: (line: number, column: number) => CompletionItem[] = (l, c) => [];

    @Output()
    codeChange = new EventEmitter<string>();

    @Output()
    breakpointsChange = new EventEmitter<readonly number[]>();

    private _code = "";
    private codeInEditor = "";
    private _errors: readonly Error[] = [];
    private _currentRange: LineTextRange | null = null;
    private _breakpoints: readonly number[] = [];
    private breakpointsInEditor: readonly number[] = [];
    private editorView: EditorView | null = null;
    private readonly editorTheme = new Compartment();
    private colorTheme = ColorTheme.light; 

    constructor(private readonly hostElement: ElementRef, private readonly colorThemeService: ColorThemeService) {
        this.colorThemeService.colorTheme$.subscribe(ct => {
            this.colorTheme = ct;
            this.updateTheme();
        });
    }

    ngAfterViewInit(): void {
        this.editorView = new EditorView({
            doc: this._code,
            extensions: [
                currentRangeHighlighting(),
                breakpoints(),
                keymap.of([...defaultKeymap, ...tabKeymap]),
                basicSetup,
                applicationStyle,
                this.editorTheme.of(this.colorThemeToStyle(this.colorTheme)),
                karel(),
                codeCompletion((line, column) => this.completionItemsProvider(line, column)),
                EditorView.updateListener.of(u => this.onEditorViewUpdate(u))
                //indentUnit.of("  ")
            ],
            parent: this.hostElement.nativeElement.children[0]
        });
        this.updateCode();
        this.updateDiagnostics();
        this.updateCurrentRange();
        this.updateBreakpoints();
    }

    private onEditorViewUpdate(update: ViewUpdate) {
        if (update.docChanged) {
            this.codeInEditor = update.state.doc.toString();
            this.codeChange.emit(this.codeInEditor);
        }

        if (breakpointsChanged(update)) {
            this.breakpointsInEditor = getBreakpoints(update.state);
            this.breakpointsChange.emit(this.breakpointsInEditor);
        }
    }

    private updateCode() {
        if (this.editorView !== null && this.codeInEditor !== this.code) {
            this.codeInEditor = this.code;
            this.editorView.dispatch({ changes: { from: 0, to: this.editorView.state.doc.length, insert: this.code } });
        }
    }

    private updateDiagnostics() {
        if (this.editorView !== null)
            this.editorView.dispatch(setErrors(this.editorView.state, this.errors));
    }

    private updateCurrentRange() {
        if (this.editorView !== null)
            this.editorView.dispatch(setCurrentRange(this.editorView.state, this.currentRange));
    }

    private updateBreakpoints() {
        if (this.editorView !== null && this.breakpointsInEditor !== this.breakpoints) {
            this.breakpointsInEditor = this.breakpoints;
            this.editorView.dispatch(setBreakpoints(this.editorView.state, this.breakpoints));
        }
    }

    private updateTheme() {
        if (this.editorView !== null) {
            this.editorView.dispatch({
                effects: this.editorTheme.reconfigure(this.colorThemeToStyle(this.colorTheme))
            });
        }
    }

    private colorThemeToStyle(colorTheme: ColorTheme) {
        if (colorTheme === ColorTheme.light)
            return applicationStyleLight;
        else
            return applicationStyleDark;
    }
}
