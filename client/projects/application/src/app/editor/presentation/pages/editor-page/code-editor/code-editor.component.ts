import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { karel } from "./codemirror/karel-codemirror-language";
import { applicationStyle } from "./codemirror/application-codemirror-style";


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

    @Output()
    codeChange = new EventEmitter<string>();

    private _code = "";
    private codeInEditor = "";
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
                    this.codeInEditor = u.state.doc.toString();
                    this.codeChange.emit(this.codeInEditor);
                })
                //indentUnit.of("  ")
            ],
            parent: this.hostElement.nativeElement.children[0]
        });
        this.codeInEditor = this.code;
    }
}
