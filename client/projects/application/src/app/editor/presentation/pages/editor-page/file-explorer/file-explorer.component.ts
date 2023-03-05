import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CodeFile } from "projects/karel/src/lib/project/code-file";
import { File } from "projects/karel/src/lib/project/file";
import { TownFile } from "projects/karel/src/lib/project/town-file";

@Component({
    selector: "app-file-explorer",
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
    fileAdd = new EventEmitter<FileExplorerFileAdd>();

    @Output()
    fileRemove = new EventEmitter<File>();

    @Output()
    fileSelect = new EventEmitter<File>();

    getFileIconURL(file: File): string {
        if (file instanceof CodeFile)
            return "http://karlbot.cz/assets/files/code-file.png";
        else if (file instanceof TownFile)
            return "http://karlbot.cz/assets/files/town-file.png";
        else
            throw new Error("");
    }
}

interface FileExplorerFileAdd {
    name: string,
    type: FileExplorerFileAddType
}

enum FileExplorerFileAddType {
    code,
    town
}