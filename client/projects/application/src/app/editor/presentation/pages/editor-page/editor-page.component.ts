import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { EditorService } from "../../../application/services/editor.service";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { ErrorListComponent } from "./error-list/error-list.component";
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { HeaderComponent } from "./header/header.component";
import { SettingsComponent } from "./settings/settings.component";
import { TownEditorComponent } from "./town-editor/town-editor.component";

@Component({
    standalone: true,
    selector: "app-editor-page",
    imports: [CommonModule, FileExplorerComponent, CodeEditorComponent, TownEditorComponent, ErrorListComponent, SettingsComponent, HeaderComponent],
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"],
    providers: [EditorService]
})
export class EditorPageComponent {
    readonly completionItemsProvider = (line: number, column: number) => this.editorService.provideCompletionItems(line, column);

    constructor(readonly editorService: EditorService) {

    }
}
