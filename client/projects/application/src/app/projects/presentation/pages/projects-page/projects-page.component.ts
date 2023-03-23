import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from 'projects/application/src/app/shared/application/services/project.service';
import { MatButtonModule } from '@angular/material/button';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { SavedProjectViewComponent } from './saved-project-view/saved-project-view.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { DialogService } from 'projects/application/src/app/shared/presentation/services/dialog.service';

@Component({
    selector: 'app-projects-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule, SavedProjectViewComponent, MatIconModule, RouterModule, PageComponent],
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {
    projects: SavedProject[] = [];

    constructor(private readonly projectService: ProjectService, private readonly dialogService: DialogService) {

    }

    async ngOnInit() {
        this.loadProjects();
    }

    async onRemoveClick(project: SavedProject) {
        const confirmed = await this.dialogService.showConfirm("Are you sure?", `Do you really want to delete project '${project.project.name}'?`);
        if (!confirmed)
            return;
            
        await this.projectService.delete(project);
        this.loadProjects();
    }

    private async loadProjects() {
        this.projects = await this.projectService.get();
    }
}
