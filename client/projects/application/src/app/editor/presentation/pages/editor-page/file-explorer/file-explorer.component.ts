import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { StopClickPropagationDirective } from "projects/application/src/app/shared/presentation/directives/stop-click-propagation.directive";
import { DialogService } from "projects/application/src/app/shared/presentation/services/dialog.service";
import { CodeFile } from "karel";
import { File } from "karel";
import { TownFile } from "karel";
import { PanelComponent } from "../../../components/panel/panel.component";

@Component({
    standalone: true,
    selector: "app-file-explorer",
    imports: [CommonModule, MatMenuModule, MatIconModule, MatListModule, PanelComponent, MatButtonModule, StopClickPropagationDirective],
    templateUrl: "./file-explorer.component.html",
    styleUrls: ["./file-explorer.component.css"]
})
export class FileExplorerComponent implements OnChanges {
    @Input()
    files: readonly File[] = [];

    @Input()
    selectedCodeFile: CodeFile | null = null;

    @Input()
    selectedTownFile: TownFile | null = null;

    @Input()
    disableCodeFileSelect = false;

    @Input()
    disableTownFileSelect = false;

    @Input()
    readonly = false;

    @Output()
    codeFileAdd = new EventEmitter<string>();

    @Output()
    townFileAdd = new EventEmitter<string>();

    @Output()
    fileRemove = new EventEmitter<File>();

    @Output()
    fileRename = new EventEmitter<FileExplorerRenameEvent>();

    @Output()
    fileSelect = new EventEmitter<File>();

    sortedFiles: readonly File[] = [];

    constructor(private readonly dialogService: DialogService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ("files" in changes)
            this.sortedFiles = this.sortFiles(this.files);
    }

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
        const confirmed = await this.dialogService.showConfirmation("Are you sure?", `Do you really want to delete file '${file.name}'?`);
        if (!confirmed)
            return;

        this.fileRemove.emit(file);
    }

    async onFileRename(file: File) {
        const validator = this.createFileNameValidator(file);
        const newName = await this.dialogService.showPrompt("Rename file", "Enter a new name of the file", file.name, validator);
        if (newName === null)
            return;

        this.fileRename.emit({ file, newName });
    }

    onFileSelect(file: File) {
        if (this.isDisabled(file))
            return;

        this.fileSelect.emit(file);
    }

    getFileIconURL(file: File): string {
        if (file instanceof CodeFile)
            return "assets/editor/presentation/pages/editor/file-explorer/code-file.png";
        else if (file instanceof TownFile)
            return "assets/editor/presentation/pages/editor/file-explorer/town-file.png";
        else
            throw new Error("");
    }

    isDisabled(file: File) {
        if (file instanceof CodeFile && this.disableCodeFileSelect && file !== this.selectedCodeFile)
            return true;
        if (file instanceof TownFile && this.disableTownFileSelect && file !== this.selectedTownFile)
            return true;

        return false;
    }

    private createFileNameValidator(file: File | null) {
        return (fileName: string) => {
            if (fileName === "")
                return false;

            return this.files.every(f => f.name !== fileName || f.name === file?.name);
        };
    }

    private sortFiles(files: readonly File[]): readonly File[] {
        const sortedFiles = [...files];
        sortedFiles.sort((a, b) => {
            const aTypeSortOrder = this.getFileTypeSortOrder(a);
            const bTypeSortOrder = this.getFileTypeSortOrder(b);
            if (aTypeSortOrder < bTypeSortOrder) return -1;
            if (aTypeSortOrder > bTypeSortOrder) return 1;
            return a.name.localeCompare(b.name, "en");
        });
        return sortedFiles;
    }

    private getFileTypeSortOrder(file: File): number {
        if (file instanceof CodeFile)
            return 0;
        else if (file instanceof TownFile)
            return 1;
        else
            throw new Error();
    }
}

interface FileExplorerRenameEvent {
    readonly file: File;
    readonly newName: string;
}