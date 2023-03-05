import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EditorService } from "../../../application/services/editor.service";

@Component({
    selector: "app-editor-page",
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"],
    providers: [EditorService]
})
export class EditorPageComponent {
    constructor(readonly editorService: EditorService, private readonly dialogService: MatDialog) {

    }
}
