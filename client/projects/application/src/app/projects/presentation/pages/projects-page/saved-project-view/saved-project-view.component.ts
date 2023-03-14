import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { TownViewComponent } from 'projects/application/src/app/shared/presentation/components/town-view/town-view.component';
import { Project, ProjectDeserializer, ProjectSerializer, Settings, Town, TownFile } from 'projects/karel/src/public-api';

@Component({
    selector: 'app-saved-project-view',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule, MatRippleModule, TownViewComponent],
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
        this._project = this.getProject(value);
        this._town = this.getTown(this._project);
    }

    @Output()
    removeClick = new EventEmitter<void>();

    get project(): Project {
        return this._project;
    }

    get town(): Town | null {
        return this._town;
    }

    private _savedProject: SavedProject = this.createSavedProject();
    private _project = this.getProject(this._savedProject);
    private _town = this.getTown(this._project);

    private getProject(savedProject: SavedProject): Project {
        return ProjectDeserializer.deserialize(savedProject.projectFile, []);
    }

    private getTown(project: Project): Town | null {
        const townFile = project.files.filter(f => f instanceof TownFile)[0] as TownFile | undefined;
        return townFile?.town ?? null;
    }

    private createSavedProject(): SavedProject {
        return {
            id: 0,
            authorId: "",
            created: new Date(),
            modified: new Date(),
            isPublic: false,
            projectFile: ProjectSerializer.serialize(Project.create("test", [], [], new Settings("", 0, 0)))
        };
    }
}
