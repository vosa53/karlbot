import { Component } from "@angular/core";
import { EditorService } from "../../../application/services/editor.service";

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"],
    providers: [EditorService]
})
export class EditorPageComponent {
    readonly completionItemsProvider = (line: number, column: number) => this.editorService.provideCompletionItems(line, column);

    constructor(readonly editorService: EditorService) {

    }
}
