import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CompletionItem } from 'projects/karel/src/lib/compiler/language-service/completion-item';
import { CodeFile } from 'projects/karel/src/lib/project/code-file';
import { File } from 'projects/karel/src/lib/project/file';
import { Project } from 'projects/karel/src/lib/project/project';
import { Settings } from 'projects/karel/src/lib/project/settings';
import { TownFile } from 'projects/karel/src/lib/project/town-file';
import { StandardLibrary } from 'projects/karel/src/lib/standard-library/standard-library';
import { ProjectDeserializer } from 'projects/karel/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { SavedProject } from '../../../shared/application/models/saved-project';
import { ProjectService } from '../../../shared/application/services/project.service';
import { SignInService } from '../../../shared/application/services/sign-in.service';
import { DialogService } from '../../../shared/presentation/services/dialog.service';
import { NotificationService } from '../../../shared/presentation/services/notification.service';
import { TownCamera } from '../../../shared/presentation/town/town-camera';
import { EditorDialogService } from '../../presentation/services/editor-dialog.service';
import { ProjectEditorService } from './project-editor.service';
import { RunService, RunState } from './run.service';

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

    async openProject(projectId: number | null) {
        if (projectId !== null) {
            const savedProject = await this.projectService.getById(projectId);
            const project = savedProject.project.withExternalPrograms(StandardLibrary.getProgramReferences());
            
            this.projectEditorService.setProject(project);
            this.savedProject.next(savedProject);
        }
        else {
            this.projectEditorService.setProject(this.createNewProject());
            this.savedProject.next(null);
        }
    }

    async saveProject() {
        const currentUser = await this.signInService.currentUser;
        if (currentUser === null) {
            this.dialogService.showMessage("Sign in please", "You must be signed in to save projects. Or alternatively, you can export it to your device even without signing in.");
            return;
        }
        
        let savedProject: SavedProject;
        if (this.savedProject.value === null) {
            const toAdd = {
                id: 0,
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
            savedProject = await this.projectService.getById(toUpdate.id);
        }
        this.savedProject.next(savedProject);
        this.notificationService.show("Project was successfully saved.");
    }

    async importProject() {
        if (this.savedProject.value !== null) {
            const confirmed = this.dialogService.showConfirmation("Are you sure?", "The imported project will replace the current project, do you want to continue?");
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

        const newSavedProject = {
            ...savedProject,
            isPublic: newIsProjectPublic
        };
        this.savedProject.next(newSavedProject);
    }

    provideCompletionItems(line: number, column: number): CompletionItem[] {
        return this.projectEditorService.provideCompletionItems(line, column);
    }

    private createNewProject(): Project {
        return ProjectDeserializer.deserialize("{\"name\":\"Project\",\"settings\":{\"entryPoint\":\"DFS\",\"karelSpeed\":200,\"maxRecursionDepth\":1000},\"files\":[{\"type\":\"code\",\"name\":\"DFS\",\"code\":\"\/**\\n * Karel program doing a depth first search algorithm.\\n *\/\\nprogram DFS\\n    put\\n    repeat 4 times\\n        if not wall\\n            step\\n            if not sign\\n                DFS\\n            end\\n            turnBack\\n            step\\n            turnBack\\n        end\\n        turnLeft\\n    end\\nend\\n\",\"breakpoints\":[]},{\"type\":\"code\",\"name\":\"Utils\",\"code\":\"program turnRight\\n    repeat 3 times\\n        turnLeft\\n    end\\nend\\n\\nprogram turnBack\\n    repeat 2 times\\n        turnLeft\\n    end\\nend\\n\",\"breakpoints\":[]},{\"type\":\"town\",\"name\":\"Village\",\"town\":{\"width\":10,\"height\":10,\"karelPosition\":{\"x\":1,\"y\":5},\"karelDirection\":1,\"homePosition\":{\"x\":8,\"y\":6},\"tiles\":[0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,1,1,0,0,0],\"signCounts\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},{\"type\":\"town\",\"name\":\"Town\",\"town\":{\"width\":20,\"height\":20,\"karelPosition\":{\"x\":0,\"y\":0},\"karelDirection\":1,\"homePosition\":{\"x\":0,\"y\":0},\"tiles\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"signCounts\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}]}", StandardLibrary.getProgramReferences());
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