import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { StopClickPropagationDirective } from "projects/application/src/app/shared/presentation/directives/stop-click-propagation.directive";
import { DialogService } from "projects/application/src/app/shared/presentation/services/dialog.service";
import { CodeFile } from "projects/karel/src/lib/project/code-file";
import { File } from "projects/karel/src/lib/project/file";
import { TownFile } from "projects/karel/src/lib/project/town-file";
import { PanelComponent } from "../../../components/panel/panel.component";

@Component({
    standalone: true,
    selector: "app-file-explorer",
    imports: [CommonModule, MatMenuModule, MatIconModule, MatListModule, PanelComponent, MatButtonModule, StopClickPropagationDirective],
    templateUrl: "./file-explorer.component.html",
    styleUrls: ["./file-explorer.component.css"]
})
export class FileExplorerComponent {
    @Input()
    files: readonly File[] = [];

    @Input()
    selectedCodeFile: CodeFile | null = null;

    @Input()
    selectedTownFile: TownFile | null = null;

    @Output()
    codeFileAdd = new EventEmitter<string>();

    @Output()
    townFileAdd = new EventEmitter<string>();

    @Output()
    fileRemove = new EventEmitter<File>();

    @Output()
    fileSelect = new EventEmitter<File>();

    constructor(private readonly dialogService: DialogService) { }

    async onFileAdd(fileType: "code" | "town") {
        const validator = this.createFileNameValidator(null);
        const fileName = await this.dialogService.showPrompt("Add file", "Enter a name of the new file", "", validator);

        if (fileName === null)
            return;

        if (fileType === "code")
            this.codeFileAdd.emit(fileName);
        else
            this.townFileAdd.emit(fileName);
    }

    async onFileRemove(file: File) {
        // TODO: Add a confirm dialog.
        this.fileRemove.emit(file);
    }

    getFileIconURL(file: File): string {
        if (file instanceof CodeFile)
            return "http://karlbot.cz/assets/files/code-file.png";
        else if (file instanceof TownFile)
            return "http://karlbot.cz/assets/files/town-file.png";
        else
            throw new Error("");
    }

    private createFileNameValidator(file: File | null) {
        return (fileName: string) => {
            if (fileName === "")
                return false;

            return this.files.every(f => f.name !== fileName || f.name === file?.name);
        };
    }
}
