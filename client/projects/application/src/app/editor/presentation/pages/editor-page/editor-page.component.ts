import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { EditorArea, EditorService } from "../../../application/services/editor.service";
import { ErrorListComponent } from "./error-list/error-list.component";
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { HeaderComponent } from "./header/header.component";
import { SettingsComponent } from "./settings/settings.component";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatTabsModule, MAT_TABS_CONFIG } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { CallStackComponent } from "./call-stack/call-stack.component";
import { CodeEditorComponent } from "projects/application/src/app/shared/presentation/components/code-editor/code-editor.component";
import { TownEditorComponent } from "projects/application/src/app/shared/presentation/components/town-editor/town-editor.component";
import { map } from "rxjs";
import { ProjectEditorService } from "../../../application/services/project-editor.service";
import { RunService } from "../../../application/services/run.service";

/**
 * Main page of the application. Allows to edit a project and to run a program.
 */
@Component({
    standalone: true,
    selector: "app-editor-page",
    imports: [CommonModule, FileExplorerComponent, CodeEditorComponent, TownEditorComponent, ErrorListComponent, SettingsComponent, HeaderComponent, MatTabsModule, CallStackComponent],
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"],
    providers: [EditorService, ProjectEditorService, RunService, { provide: MAT_TABS_CONFIG, useValue: { animationDuration: 100 }}]
})
export class EditorPageComponent {
    /**
     * Code editor component.
     */
    @ViewChild(CodeEditorComponent)
    codeEditor: CodeEditorComponent | null = null;

    /**
     * Function for the code editor providing completion items at the given position in the code.
     */
    readonly completionItemsProvider = (line: number, column: number) => this.editorService.provideCompletionItems(line, column);

    /**
     * Whether to use a small screen layout.
     */
    isSmallScreen = false;

    /**
     * Index of the currently selected tab. Used only in the small screen layout.
     */
    readonly selectedTabIndex$ = this.editorService.activeArea$.pipe(map(a => {
        if (a === EditorArea.files || a === EditorArea.settings)
            return 0;
        else if (a === EditorArea.code || a === EditorArea.errors || a === EditorArea.callStack)
            return 1;
        else if (a === EditorArea.town)
            return 2;
        else
            throw new Error("Unknown tab index.");
    }));

    constructor(
        readonly editorService: EditorService, 
        private readonly breakpointObserver: BreakpointObserver, 
        private readonly activatedRoute: ActivatedRoute
    ) {
        breakpointObserver.observe(["(max-width: 1000px)"]).subscribe(b => this.isSmallScreen = b.matches);
        
        this.activatedRoute.paramMap.subscribe(async p => {
            const id = p.get("id");
            if (id !== null)
                editorService.openProject(id);
            else
                editorService.newProject();
        });
    }

    onSelectedTabIndexChange(newValue: number) {
        if (newValue === 0)
            this.editorService.setActiveArea(EditorArea.files);
        else if (newValue === 1)
            this.editorService.setActiveArea(EditorArea.code);
        else if (newValue === 2)
            this.editorService.setActiveArea(EditorArea.town);
        else
            throw new Error("Unknown tab index.");
    }

    onCodeEditorFocusIn() {
        this.editorService.setActiveArea(EditorArea.code);
    }

    onTownEditorFocusIn() {
        this.editorService.setActiveArea(EditorArea.town);
    }

    onUndoClick() {
        this.codeEditor?.undo();
    }

    onRedoClick() {
        this.codeEditor?.redo();
    }
}
