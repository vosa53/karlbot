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

/**
 * Allows to manage files in the open project.
 */
@Component({
    standalone: true,
    selector: "app-file-explorer",
    imports: [CommonModule, MatMenuModule, MatIconModule, MatListModule, PanelComponent, MatButtonModule, StopClickPropagationDirective],
    templateUrl: "./file-explorer.component.html",
    styleUrls: ["./file-explorer.component.css"]
})
export class FileExplorerComponent implements OnChanges {
    /**
     * Files in the project.
     */
    @Input()
    files: readonly File[] = [];

    /**
     * Selected code file.
     */
    @Input()
    selectedCodeFile: CodeFile | null = null;

    /**
     * Selected town file.
     */
    @Input()
    selectedTownFile: TownFile | null = null;

    /**
     * Whether code file selecting is enabled.
     */
    @Input()
    disableCodeFileSelect = false;
    
    /**
     * Whether town file selecting is enabled.
     */
    @Input()
    disableTownFileSelect = false;

    /**
     * Whether the files can not be changed.
     */
    @Input()
    readonly = false;

    /**
     * Emitted when the user wants to add a code file.
     */
    @Output()
    codeFileAdd = new EventEmitter<string>();

    /**
     * Emitted when the user wants to add a town file.
     */
    @Output()
    townFileAdd = new EventEmitter<string>();

    /**
     * Emitted when the user wants to remove a file.
     */
    @Output()
    fileRemove = new EventEmitter<File>();

    /**
     * Emitted when the user wants to rename a file.
     */
    @Output()
    fileRename = new EventEmitter<FileExplorerRenameEvent>();

    /**
     * Emitted when the user wants to select a file.
     */
    @Output()
    fileSelect = new EventEmitter<File>();

    /**
     * The files sorted by type and name.
     */
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
            const byType = this.getFileTypeSortOrder(a) - this.getFileTypeSortOrder(b);
            if (byType !== 0) return byType;

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
            throw new Error("Unknown file type.");
    }
}

/** 
 * Event emitted when the user wants to rename a file. 
 */
export interface FileExplorerRenameEvent {
    /**
     * File to be renamed.
     */
    readonly file: File;

    /**
     * New name of the file.
     */
    readonly newName: string;
}