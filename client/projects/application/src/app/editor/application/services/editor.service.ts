import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { CompletionItem } from "karel";
import { CodeFile } from "karel";
import { File } from "karel";
import { Project } from "karel";
import { Settings } from "karel";
import { TownFile } from "karel";
import { StandardLibrary } from "karel";
import { ProjectDeserializer } from "karel";
import { BehaviorSubject, combineLatest, firstValueFrom, map } from "rxjs";
import { SavedProject } from "../../../shared/application/models/saved-project";
import { ProjectService } from "../../../shared/application/services/api/project.service";
import { SignInService } from "../../../shared/application/services/sign-in.service";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { NotificationService } from "../../../shared/presentation/services/notification.service";
import { TownCamera } from "../../../shared/presentation/town/town-camera";
import { EditorDialogService } from "../../presentation/services/editor-dialog.service";
import { ProjectEditorService } from "./project-editor.service";
import { RunService, RunState } from "./run.service";

/**
 * Provides facade for an editor and communicates with the server API.
 */
@Injectable()
export class EditorService {
    private readonly savedProject = new BehaviorSubject<SavedProject | null>(null);
    private readonly activeArea = new BehaviorSubject<EditorArea>(EditorArea.code);

    /**
     * Editor area where the user currently is.
     */
    readonly activeArea$ = this.activeArea.asObservable();

    /**
     * Edited project.
     */
    readonly project$ = this.projectEditorService.project$;

    /**
     * Selected code file.
     */
    readonly selectedCodeFile$ = this.projectEditorService.selectedCodeFile$;

    /**
     * Selected town file.
     */
    readonly selectedTownFile$ = this.projectEditorService.selectedTownFile$;

    /**
     * Code from the selected code file.
     */
    readonly currentCode$ = this.projectEditorService.currentCode$;

    /**
     * Town from the selected town file.
     */
    readonly currentTown$ = this.projectEditorService.currentTown$;

    /**
     * Town camera in the town editor.
     */
    readonly currentTownCamera$ = this.projectEditorService.currentTownCamera$;

    /**
     * Names of programs that can be used as an entry point.
     */
    readonly availableEntryPoints$ = this.projectEditorService.availableEntryPoints$;

    /**
     * Errors in the whole project.
     */
    readonly errors$ = this.projectEditorService.errors$;

    /**
     * Errors in the selected code file.
     */
    readonly errorsInCurrentCodeFile$ = this.projectEditorService.errorsInCurrentCodeFile$;

    /**
     * State of the program execution.
     */
    readonly runState$ = this.runService.state$;

    /**
     * Snapshot of the call stack.
     */
    readonly callStack$ = this.runService.callStack$;

    /**
     * Source code range of the next executed instruction.
     */
    readonly currentRange$ = this.runService.currentRange$;

    /**
     * Whether the current user is an author of the opened project.
     */
    readonly isProjectOwn$ = combineLatest([this.savedProject, this.signInService.currentUser$]).pipe(
        map(([savedProject, currentUser]) => {
            if (savedProject === null)
                return true;
            
            return savedProject.authorId === currentUser?.id;
        })
    );

    constructor(
        private readonly projectEditorService: ProjectEditorService, 
        private readonly runService: RunService,
        private readonly dialogService: DialogService,
        private readonly editorDialogService: EditorDialogService, 
        private readonly projectService: ProjectService, 
        private readonly signInService: SignInService, 
        private readonly location: Location, 
        private readonly notificationService: NotificationService
    ) {
        this.projectEditorService.setProject(this.createNewProject());
        this.runState$.subscribe(rs => {
            if (rs === RunState.paused)
                this.activeArea.next(EditorArea.code);
        });
    }

    /**
     * Sets an editor area where the user currently is.
     * @param area Editor area.
     */
    setActiveArea(area: EditorArea) {
        this.activeArea.next(area);
    }

    /**
     * Creates a new project.
     */
    newProject() {
        this.location.go("editor");

        this.projectEditorService.setProject(this.createNewProject());
        this.savedProject.next(null);
    }

    /**
     * Opens a project saved on the server with the given ID.
     * @param projectId Project ID.
     */
    async openProject(projectId: string) {
        this.location.go(`editor/${projectId}`);

        const savedProject = await this.projectService.getById(projectId);
        const project = savedProject.project.withExternalPrograms(StandardLibrary.getProgramReferences());
            
        this.projectEditorService.setProject(project);
        this.savedProject.next(savedProject);
    }

    /**
     * Saves the project to the server.
     */
    async saveProject() {
        const currentUser = await firstValueFrom(this.signInService.currentUser$);
        if (currentUser === null) {
            await this.dialogService.showMessage("Sign in please", "You must be signed in to save projects. Or alternatively, you can export it to your device even without signing in.");
            return;
        }

        const isProjectOwn = await firstValueFrom(this.isProjectOwn$);
        if (!isProjectOwn) {
            const confirmed = await this.dialogService.showConfirmation("Create a copy?", "This project is not yours, do you want to fork it?");
            if (!confirmed)
                return;
        }
        
        let savedProject: SavedProject;
        if (this.savedProject.value === null || !isProjectOwn) {
            const toAdd = {
                id: null,
                created: new Date(),
                modified: new Date(),
                isPublic: true,
                authorId: currentUser.id,
                project: this.projectEditorService.getProject()
            };
            savedProject = await this.projectService.add(toAdd);

            this.location.go(`editor/${savedProject.id}`);
        }
        else {
            const toUpdate = {
                ...this.savedProject.value,
                project: this.projectEditorService.getProject()
            };
            await this.projectService.update(toUpdate);
            savedProject = await this.projectService.getById(toUpdate.id!);
        }
        this.savedProject.next(savedProject);
        this.notificationService.show("Project was successfully saved.");
    }

    /**
     * Imports a project locally from the device.
     */
    async importProject() {
        if (this.savedProject.value !== null) {
            const confirmed = await this.dialogService.showConfirmation("Are you sure?", "The imported project will replace the current saved project, do you want to continue?");
            if (!confirmed)
                return;
        }

        this.projectEditorService.importProject();
    }

    /**
     * Exports the project locally to the device.
     */
    async exportProject() {
        this.projectEditorService.exportProject();
    }

    /**
     * Creates a new code file.
     * @param name Name of the new file.
     */
    addCodeFile(name: string) {
        this.projectEditorService.addCodeFile(name);
        this.activeArea.next(EditorArea.code);
    }

    /**
     * Creates a new town file.
     * @param name Name of the new file.
     */
    addTownFile(name: string) {
        this.projectEditorService.addTownFile(name);
        this.activeArea.next(EditorArea.town);
    }

    /**
     * Removes a file.
     * @param file File to remove.
     */
    removeFile(file: File) {
        this.projectEditorService.removeFile(file);
    }

    /**
     * Renames a file.
     * @param file File to rename.
     * @param newName New name of the file.
     */
    renameFile(file: File, newName: string) {
        this.projectEditorService.renameFile(file, newName);
    }

    /**
     * Selects a file.
     * @param file File to select.
     */
    selectFile(file: File) {
        this.projectEditorService.selectFile(file);

        if (file instanceof CodeFile)
            this.activeArea.next(EditorArea.code);
        else if (file instanceof TownFile)
            this.activeArea.next(EditorArea.town);
    }

    /**
     * Runs the program.
     * @param readonly Whether the town should be reverted back after the program ends.
     */
    async run(readonly: boolean) {
        const success = await this.runService.run(readonly);
        if (success)
            this.activeArea.next(EditorArea.town);
    }

    /**
     * Stops the running program.
     */
    stop() {
        this.runService.stop();
    }

    /**
     * Pauses the running program.
     */
    pause() {
        this.runService.pause();
    }

    /**
     * Resumes the paused program.
     */
    continue() {
        this.runService.continue();
    }

    /**
     * Performs debugger "step into" action.
     */
    stepInto() {
        this.runService.stepInto();
    }

    /**
     * Performs debugger "step over" action.
     */
    stepOver() {
        this.runService.stepOver();
    }

    /**
     * Performs debugger "step out" action.
     */
    stepOut() {
        this.runService.stepOut();
    }

    /**
     * Changes the code in the open code file.
     * @param code New code.
     */
    changeCode(code: string) {
        this.projectEditorService.changeCode(code);
    }

    /**
     * Sets breakpoints on the given lines.
     * @param breakpoints Line numbers where the breakpoints should be set. Line number starts at 1.
     */
    async changeBreakpoints(breakpoints: readonly number[]) {
        this.projectEditorService.changeBreakpoints(breakpoints);
        await this.runService.changeBreakpoints(breakpoints);
    }

    /**
     * Changes the town camera in the town editor.
     * @param townCamera New town camera.
     */
    changeCurrentTownCamera(townCamera: TownCamera) {
        this.projectEditorService.changeCurrentTownCamera(townCamera);
    }

    /**
     * Changes the project settings.
     * @param settings New settings.
     */
    changeSettings(settings: Settings) {
        this.projectEditorService.changeSettings(settings);
    }

    /**
     * Changes the project name.
     * @param projectName New project name.
     */
    changeProjectName(projectName: string) {
        this.projectEditorService.changeProjectName(projectName);
    }

    /**
     * Changes the name of the project entry point.
     * @param entryPoint New entry point name.
     */
    changeEntryPoint(entryPoint: string) {
        this.projectEditorService.changeEntryPoint(entryPoint);
    }

    /**
     * Shares the project.
     */
    async share() {
        const savedProject = this.savedProject.value;
        if (savedProject === null) {
            await this.dialogService.showMessage("Please save the project", "An unsaved project can not be shared. Please save it first.");
            return;
        }

        const projectUrl = window.location.origin + "/editor/" + savedProject.id;
        const newIsProjectPublic = await this.editorDialogService.showShare(savedProject.isPublic, projectUrl);
        if (newIsProjectPublic === null)
            return;

        const toUpdate = {
            ...savedProject,
            isPublic: newIsProjectPublic
        };
        await this.projectService.update(toUpdate);
        this.savedProject.next(toUpdate);
    }

    /**
     * Provides completion items at the given code position.
     * @param line Line number. Starts at 1.
     * @param column Column number. Starts at 1.
     */
    provideCompletionItems(line: number, column: number): CompletionItem[] {
        return this.projectEditorService.provideCompletionItems(line, column);
    }

    private createNewProject(): Project {
        return ProjectDeserializer.deserialize("{\"name\":\"Project\",\"settings\":{\"entryPoint\":\"main\",\"karelSpeed\":200,\"maxRecursionDepth\":1000},\"files\":[{\"type\":\"code\",\"name\":\"Main\",\"code\":\"program main\\n    step\\n    step\\n    turnLeft\\n    step\\n    \/\/ Write code here\\n    // Language guide is available under the help icon in the navigation\\nend\\n\",\"breakpoints\":[]},{\"type\":\"town\",\"name\":\"Karel's Village\",\"town\":{\"width\":10,\"height\":10,\"karelPosition\":{\"x\":1,\"y\":5},\"karelDirection\":1,\"homePosition\":{\"x\":8,\"y\":6},\"tiles\":[0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,1,1,0,0,0],\"signCounts\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}]}", StandardLibrary.getProgramReferences());
    }
}

/**
 * Area of an editor.
 */
export enum EditorArea {
    /**
     * Files.
     */
    files = "files",

    /**
     * Settings.
     */
    settings = "settings",

    /**
     * Code.
     */
    code = "code",

    /**
     * Errors.
     */
    errors = "errors",

    /**
     * Call stack.
     */
    callStack = "callStack",

    /**
     * Town.
     */
    town = "town"
}