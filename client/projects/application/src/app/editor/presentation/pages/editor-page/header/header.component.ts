import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { EditorState } from "../../../../application/services/editor.service";
import { MatDividerModule } from "@angular/material/divider";
import { DialogService } from "projects/application/src/app/shared/presentation/services/dialog.service";
import { ValidatedInputValidator } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";

@Component({
    standalone: true,
    selector: "app-header",
    imports: [CommonModule, MatIconModule, MatSelectModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatDividerModule],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent {
    @Input()
    editorState = EditorState.ready;

    @Input()
    projectName: string = "";

    @Input()
    availableEntryPoints: string[] = [];

    @Input()
    entryPoint: string = "";

    @Output()
    projectNameChange = new EventEmitter<string>();

    @Output()
    entryPointChange = new EventEmitter<string>();

    @Output()
    newClick = new EventEmitter<void>();

    @Output()
    saveClick = new EventEmitter<void>();

    @Output()
    shareClick = new EventEmitter<void>();

    @Output()
    importClick = new EventEmitter<void>();

    @Output()
    exportClick = new EventEmitter<void>();

    @Output()
    undoClick = new EventEmitter<void>();

    @Output()
    redoClick = new EventEmitter<void>();

    @Output()
    runClick = new EventEmitter<void>();

    @Output()
    runReadonlyClick = new EventEmitter<void>();

    @Output()
    stopClick = new EventEmitter<void>();

    private static readonly PROJECT_NAME_VALIDATOR: ValidatedInputValidator = t => t !== "";

    constructor(private readonly dialogService: DialogService) {

    }

    async onChangeProjectNameClick() {
        const newProjectName = await this.dialogService.showPrompt("Change project name", "Please entrer a new project name.", 
            this.projectName, HeaderComponent.PROJECT_NAME_VALIDATOR);
        if (newProjectName === null)
            return;

        this.projectNameChange.emit(newProjectName);
    }
}
