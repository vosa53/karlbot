import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { EditorService } from "../../../application/services/editor.service";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { ErrorListComponent } from "./error-list/error-list.component";
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { HeaderComponent } from "./header/header.component";
import { SettingsComponent } from "./settings/settings.component";
import { TownEditorComponent } from "./town-editor/town-editor.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTabsModule, MAT_TABS_CONFIG } from '@angular/material/tabs';
import { ActivatedRoute } from "@angular/router";
import { LineTextRange } from "projects/karel/src/public-api";

@Component({
    standalone: true,
    selector: "app-editor-page",
    imports: [CommonModule, FileExplorerComponent, CodeEditorComponent, TownEditorComponent, ErrorListComponent, SettingsComponent, HeaderComponent, MatTabsModule],
    templateUrl: "./editor-page.component.html",
    styleUrls: ["./editor-page.component.css"],
    providers: [EditorService, { provide: MAT_TABS_CONFIG, useValue: { animationDuration: 100 }}]
})
export class EditorPageComponent {
    readonly completionItemsProvider = (line: number, column: number) => this.editorService.provideCompletionItems(line, column);
    isSmallScreen: boolean = false;

    currentRange: LineTextRange | null = null;

    constructor(readonly editorService: EditorService, readonly breakpointObserver: BreakpointObserver, readonly activatedRoute: ActivatedRoute) {
        breakpointObserver.observe(["(max-width: 1000px)"]).subscribe(b => this.isSmallScreen = b.matches);
        
        const projectId = activatedRoute.snapshot.paramMap.get("id");
        if (projectId !== null)
            editorService.openProject(parseInt(projectId, 10));

        setTimeout(() => {
            this.currentRange = new LineTextRange(2, 3, 2, 8);
        }, 2000);
    }
}
