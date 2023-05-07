import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { DialogService } from "projects/application/src/app/shared/presentation/services/dialog.service";
import { ValidatedInputValidator } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";
import { RunState } from "../../../../application/services/run.service";

/**
 * Contains dropdown menus with all editor actions and a toolbar with those that are frequently used. It also shows the project name.
 */
@Component({
    standalone: true,
    selector: "app-header",
    imports: [CommonModule, MatIconModule, MatSelectModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatDividerModule],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent {
    /**
     * State of the program execution.
     */
    @Input()
    runState = RunState.ready;

    /**
     * Name of the open project.
     */
    @Input()
    projectName = "";

    /**
     * Whether the current user is an author of the opened project.
     */
    @Input()
    isProjectOwn = false;

    /**
     * Names of programs that can be used as an entry point.
     */
    @Input()
    availableEntryPoints: string[] = [];

    /**
     * Name of a program that is used as an entry point.
     */
    @Input()
    entryPoint = "";

    /**
     * Whether an undo action is possible.
     */
    @Input()
    canUndo = false;

    /**
     * Whether a redo action is possible.
     */
    @Input()
    canRedo = false;

    /**
     * Emitted when the user wants to change the project name.
     */
    @Output()
    projectNameChange = new EventEmitter<string>();

    /**
     * Emitted when the user wants to change the entry point.
     */
    @Output()
    entryPointChange = new EventEmitter<string>();

    /**
     * Emitted when the user clicks on a button to create a new project.
     */
    @Output()
    newClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to save the open project.
     */
    @Output()
    saveClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to share the open project.
     */
    @Output()
    shareClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to import a project saved locally in the device.
     */
    @Output()
    importClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to export the open project locally to the device.
     */
    @Output()
    exportClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to undo an action.
     */
    @Output()
    undoClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to redo an action.
     */
    @Output()
    redoClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to run the created program.
     */
    @Output()
    runClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to run the created program in read-only mode.
     */
    @Output()
    runReadonlyClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to stop a running program.
     */
    @Output()
    stopClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to pause a running program.
     */
    @Output()
    pauseClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to resume running of a paused program.
     */
    @Output()
    continueClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to "step into" with the debugger.
     */
    @Output()
    stepIntoClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to "step over" with the debugger.
     */
    @Output()
    stepOverClick = new EventEmitter<void>();

    /**
     * Emitted when the user clicks on a button to "step out" with the debugger.
     */
    @Output()
    stepOutClick = new EventEmitter<void>();

    private static readonly PROJECT_NAME_VALIDATOR: ValidatedInputValidator = t => t !== "";

    constructor(private readonly dialogService: DialogService) { }

    async onChangeProjectNameClick() {
        const newProjectName = await this.dialogService.showPrompt("Change project name", "Please enter a new project name.", 
            this.projectName, HeaderComponent.PROJECT_NAME_VALIDATOR);
        if (newProjectName === null)
            return;

        this.projectNameChange.emit(newProjectName);
    }
}
