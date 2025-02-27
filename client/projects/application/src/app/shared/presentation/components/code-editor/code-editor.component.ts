import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { defaultKeymap, undo, redo } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { karel } from "./codemirror/karel-language";
import { applicationStyleLight } from "./codemirror/application-theme-light";
import { Error } from "karel";
import { CompletionItem } from "karel";
import { CommonModule } from "@angular/common";
import { LineTextRange } from "karel";
import { Compartment, TransactionSpec, EditorState } from "@codemirror/state"
import { codeCompletion } from "./codemirror/code-completion";
import { setErrors } from "./codemirror/error-highlighting";
import { currentRangeHighlighting, setCurrentRange } from "./codemirror/current-range-highlighting";
import { breakpoints, breakpointsChanged, getBreakpoints, setBreakpoints } from "./codemirror/breakpoints";
import { applicationStyle } from "./codemirror/application-theme";
import { applicationStyleDark } from "./codemirror/application-theme-dark";
import { tabKeymap } from "./codemirror/tab-keymap";
import { ColorTheme, ColorThemeService } from "../../../application/services/color-theme.service";
import { indentUnit } from "@codemirror/language";

/**
 * Code editor of the Karel language.
 */
@Component({
    standalone: true,
    selector: "app-code-editor",
    imports: [CommonModule],
    templateUrl: "./code-editor.component.html",
    styleUrls: ["./code-editor.component.css"]
})
export class CodeEditorComponent implements AfterViewInit, OnChanges {
    /**
     * Edited code.
     */
    @Input()
    code = "";

    /**
     * Whether the editor is in readonly mode.
     */
    @Input()
    readonly = false;

    /**
     * Errors to be highlighted.
     */
    @Input()
    errors: readonly Error[] = [];

    /**
     * Code range to be highlighted as currently executed.
     */
    @Input()
    currentRange: LineTextRange | null = null;
    
    /**
     * Line numbers with breakpoints. Line number starts at 1.
     */
    @Input()
    breakpoints: readonly number[] = [];

    /**
     * Function providing completion items at the given position in the code.
     */
    @Input()
    completionItemsProvider: (line: number, column: number) => CompletionItem[] = () => [];

    /**
     * Emitted when the code is changed.
     */
    @Output()
    codeChange = new EventEmitter<string>();

    /**
     * Emitted when the breakpoints are changed.
     */
    @Output()
    breakpointsChange = new EventEmitter<readonly number[]>();

    private codeInEditor = "";
    private breakpointsInEditor: readonly number[] = [];

    private editorView: EditorView | null = null;
    private readonly editorTheme = new Compartment();
    private readonly editorReadonly = new Compartment();

    private colorTheme = ColorTheme.light;

    constructor(private readonly hostElement: ElementRef, private readonly colorThemeService: ColorThemeService) {
        this.colorThemeService.colorTheme$.subscribe(ct => {
            this.colorTheme = ct;
            this.updateTheme();
        });
    }

    ngAfterViewInit(): void {
        this.editorView = new EditorView({
            state: this.createEditorState(),
            parent: this.hostElement.nativeElement.children[0]
        });
        this.codeInEditor = this.code;
        this.updateEditorFromInputs(this.editorView, null);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.editorView !== null)
            this.updateEditorFromInputs(this.editorView, changes);
    }

    private createEditorState(): EditorState {
        return EditorState.create({
            doc: this.code,
            extensions: [
                currentRangeHighlighting(),
                breakpoints(),
                keymap.of([...defaultKeymap, ...tabKeymap]),
                basicSetup,
                applicationStyle,
                this.editorTheme.of(this.colorThemeToStyle(this.colorTheme)),
                this.editorReadonly.of(EditorState.readOnly.of(this.readonly)),
                indentUnit.of("    "),
                karel(),
                codeCompletion((line, column) => this.completionItemsProvider(line, column)),
                EditorView.contentAttributes.of({ autocorrect: "off", autocomplete: "off", spellcheck: "false" }),
                EditorView.updateListener.of(u => this.onEditorViewUpdate(u))
            ]
        });
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

    private updateEditorFromInputs(view: EditorView, changes: SimpleChanges | null) {
        const transactionSpecs: TransactionSpec[] = [];

        // Code change first because next changes can depend on new positions of lines.
        if ((changes === null || "code" in changes) && this.codeInEditor !== this.code) {
            this.codeInEditor = this.code;

            // Create a whole new state to clear undo & redo history.
            const state = this.createEditorState();
            view.setState(state);
        }

        if (changes === null || "readonly" in changes)
            transactionSpecs.push({ effects: this.editorReadonly.reconfigure(EditorState.readOnly.of(this.readonly)) });

        if (changes === null || "errors" in changes)
            transactionSpecs.push(setErrors(view.state, this.errors));

        if (changes === null || "currentRange" in changes) {
            transactionSpecs.push(setCurrentRange(view.state, this.currentRange));
            if (this.currentRange !== null)
                transactionSpecs.push({ effects: EditorView.scrollIntoView(view.state.doc.line(this.currentRange.startLine).from, { y: "center"  }) });
        }

        if ((changes === null || "breakpoints" in changes) && this.breakpointsInEditor !== this.breakpoints) {
            this.breakpointsInEditor = this.breakpoints;
            transactionSpecs.push(setBreakpoints(view.state, this.breakpoints));
        }

        view.dispatch(...transactionSpecs);
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

    /**
     * Undoes the edit action.
     */
    undo() {
        if (this.editorView !== null)
            undo(this.editorView);
    }

    /**
     * Redoes the edit action.
     */
    redo() {
        if (this.editorView !== null)
            redo(this.editorView);
    }
}
