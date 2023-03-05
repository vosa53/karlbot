import { Component } from "@angular/core";
import { EditorService } from "../../../application/editor.service";

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"]
})
export class EditorPageComponent {
    constructor(readonly editorService: EditorService) {
        
    }
}
