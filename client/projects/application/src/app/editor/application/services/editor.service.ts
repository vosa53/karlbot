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

@Injectable()
export class EditorService {
    private readonly savedProject = new BehaviorSubject<SavedProject | null>(null);
    private readonly activeArea = new BehaviorSubject<EditorArea>(EditorArea.code);

    readonly activeArea$ = this.activeArea.asObservable();

    readonly project$ = this.projectEditorService.project$;
    readonly selectedCodeFile$ = this.projectEditorService.selectedCodeFile$;
    readonly selectedTownFile$ = this.projectEditorService.selectedTownFile$;
    readonly currentTown$ = this.projectEditorService.currentTown$;
    readonly currentTownCamera$ = this.projectEditorService.currentTownCamera$;
    readonly currentCode$ = this.projectEditorService.currentCode$;
    readonly availableEntryPoints$ = this.projectEditorService.availableEntryPoints$;
    readonly errors$ = this.projectEditorService.errors$;
    readonly errorsInCurrentCodeFile$ = this.projectEditorService.errorsInCurrentCodeFile$;

    readonly runState$ = this.runService.state$;
    readonly callStack$ = this.runService.callStack$;
    readonly currentRange$ = this.runService.currentRange$;

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

    setActiveArea(area: EditorArea) {
        this.activeArea.next(area);
    }

    newProject() {
        this.location.go("editor");

        this.projectEditorService.setProject(this.createNewProject());
        this.savedProject.next(null);
    }

    async openProject(projectId: string) {
        this.location.go(`editor/${projectId}`);

        const savedProject = await this.projectService.getById(projectId);
        const project = savedProject.project.withExternalPrograms(StandardLibrary.getProgramReferences());
            
        this.projectEditorService.setProject(project);
        this.savedProject.next(savedProject);
    }

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

    async importProject() {
        if (this.savedProject.value !== null) {
            const confirmed = await this.dialogService.showConfirmation("Are you sure?", "The imported project will replace the current saved project, do you want to continue?");
            if (!confirmed)
                return;
        }

        this.projectEditorService.importProject();
    }

    async exportProject() {
        this.projectEditorService.exportProject();
    }

    addCodeFile(name: string) {
        this.projectEditorService.addCodeFile(name);
        this.activeArea.next(EditorArea.code);
    }

    addTownFile(name: string) {
        this.projectEditorService.addTownFile(name);
        this.activeArea.next(EditorArea.town);
    }

    removeFile(file: File) {
        this.projectEditorService.removeFile(file);
    }

    renameFile(file: File, newName: string) {
        this.projectEditorService.renameFile(file, newName);
    }

    selectFile(file: File) {
        this.projectEditorService.selectFile(file);

        if (file instanceof CodeFile)
            this.activeArea.next(EditorArea.code);
        else if (file instanceof TownFile)
            this.activeArea.next(EditorArea.town);
    }

    async run(readonly: boolean) {
        const success = await this.runService.run(readonly);
        if (success)
            this.activeArea.next(EditorArea.town);
    }

    stop() {
        this.runService.stop();
    }

    pause() {
        this.runService.pause();
    }

    continue() {
        this.runService.continue();
    }

    stepInto() {
        this.runService.stepInto();
    }

    stepOver() {
        this.runService.stepOver();
    }

    stepOut() {
        this.runService.stepOut();
    }

    changeCode(code: string) {
        this.projectEditorService.changeCode(code);
    }

    async changeBreakpoints(breakpoints: readonly number[]) {
        this.projectEditorService.changeBreakpoints(breakpoints);
        await this.runService.changeBreakpoints(breakpoints);
    }

    changeCurrentTownCamera(townCamera: TownCamera) {
        this.projectEditorService.changeCurrentTownCamera(townCamera);
    }

    changeSettings(settings: Settings) {
        this.projectEditorService.changeSettings(settings);
    }

    changeProjectName(projectName: string) {
        this.projectEditorService.changeProjectName(projectName);
    }

    changeEntryPoint(entryPoint: string) {
        this.projectEditorService.changeEntryPoint(entryPoint);
    }

    async share() {
        const savedProject = this.savedProject.value;
        if (savedProject === null) {
            await this.dialogService.showMessage("Please save the project", "An unsaved project can not be shared. Please save it first.");
            return;
        }

        const projectUrl = window.location.host + "/editor/" + savedProject.id;
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

    provideCompletionItems(line: number, column: number): CompletionItem[] {
        return this.projectEditorService.provideCompletionItems(line, column);
    }

    private createNewProject(): Project {
        return ProjectDeserializer.deserialize("{\"name\":\"Project\",\"settings\":{\"entryPoint\":\"main\",\"karelSpeed\":200,\"maxRecursionDepth\":1000},\"files\":[{\"type\":\"code\",\"name\":\"Main\",\"code\":\"program main\\n    step\\n    step\\n    turnLeft\\n    step\\n    \/\/ Write code here\\nend\\n\",\"breakpoints\":[]},{\"type\":\"code\",\"name\":\"Syntax Guide\",\"code\":\"\/**\\n * Block comment\\n *\/\\n\\n\/\/ Line comment\\n\\n\/**\\n * User defined program\\n *\/\\nprogram emptyProgram\\n    \\nend\\n\\n\/**\\n * Built-in programs\\n *\/\\nprogram builtInPrograms\\n    \/\/ Movement\\n    step\\n    turnLeft\\n\\n    \/\/ Signs\\n    put\\n    pick\\n\\n    \/\/ Testing orientation\\n    north\\n    east\\n    west\\n    south\\n\\n    \/\/ Testing surroundings\\n    sign\\n    wall\\n    home\\nend\\n\\n\/**\\n * Control structures\\n *\/\\nprogram controlStructures\\n    \/\/ If statement\\n    if not wall\\n        \\n    end\\n\\n    \/\/ If else statement\\n    if is north\\n    \\n    end\\n    else\\n\\n    end\\n\\n    \/\/ While statement\\n    while is sign\\n\\n    end\\n\\n    \/\/ Repeat statement\\n    repeat 4 times\\n\\n    end\\nend\\n\\n\/**\\n * Recursion\\n *\/\\nprogram recursiveProgram\\n    if not wall\\n        step\\n\\n        \/\/ Recursive call\\n        recursiveProgram\\n    end\\nend\",\"breakpoints\":[]},{\"type\":\"town\",\"name\":\"Karel's Village\",\"town\":{\"width\":10,\"height\":10,\"karelPosition\":{\"x\":1,\"y\":5},\"karelDirection\":1,\"homePosition\":{\"x\":8,\"y\":6},\"tiles\":[0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,1,1,0,0,0],\"signCounts\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}]}", StandardLibrary.getProgramReferences());
    }
}

export enum EditorArea {
    files = "files",
    settings = "settings",
    code = "code",
    errors = "errors",
    callStack = "callStack",
    town = "town"
}