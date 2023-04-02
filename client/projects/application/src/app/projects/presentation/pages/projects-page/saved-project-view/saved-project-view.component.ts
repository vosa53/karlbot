import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { TownViewComponent } from 'projects/application/src/app/shared/presentation/components/town-view/town-view.component';
import { Project, Settings, Town, TownFile } from 'projects/karel/src/public-api';
import { StopClickPropagationDirective } from 'projects/application/src/app/shared/presentation/directives/stop-click-propagation.directive';
import { DateAgoPipe } from 'projects/application/src/app/shared/presentation/pipes/date-ago.pipe';
import { TownViewFitContainDirective } from 'projects/application/src/app/shared/presentation/directives/town-view-fit-contain.directive';

@Component({
    selector: 'app-saved-project-view',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, MatRippleModule, TownViewComponent, StopClickPropagationDirective, DatePipe, DateAgoPipe, TownViewFitContainDirective],
    templateUrl: './saved-project-view.component.html',
    styleUrls: ['./saved-project-view.component.css']
})
export class SavedProjectViewComponent {
    @Input()
    get savedProject(): SavedProject {
        return this._savedProject;
    }

    set savedProject(value: SavedProject) {
        if (value === this._savedProject)
            return;

        this._savedProject = value;
    }

    @Output()
    removeClick = new EventEmitter<void>();

    get project(): Project {
        return this.savedProject.project;
    }

    get town(): Town | null {
        const townFile = this.project.files.filter(f => f instanceof TownFile)[0] as TownFile | undefined;
        return townFile?.town ?? null;
    }

    private _savedProject: SavedProject = this.createSavedProject();


    private createSavedProject(): SavedProject {
        return {
            id: null,
            authorId: "",
            created: new Date(),
            modified: new Date(),
            isPublic: false,
            project: Project.create("test", [], [], new Settings("", 0, 0))
        };
    }
}
