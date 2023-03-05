import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-code-editor",
    templateUrl: "./code-editor.component.html",
    styleUrls: ["./code-editor.component.css"]
})
export class CodeEditorComponent {
    @Input()
    code: string = "";

    @Output()
    codeChange = new EventEmitter<string>();

    onCodeChange(newCode: string) {
        this.codeChange.emit(newCode);
    }
}
