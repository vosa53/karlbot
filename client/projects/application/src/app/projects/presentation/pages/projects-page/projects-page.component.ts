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
import { SignInService } from 'projects/application/src/app/shared/application/services/sign-in.service';

@Component({
    selector: 'app-projects-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule, SavedProjectViewComponent, MatIconModule, RouterModule, PageComponent],
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {
    projects: SavedProject[] | null = null;

    constructor(private readonly projectService: ProjectService, private readonly dialogService: DialogService, 
        private readonly signInService: SignInService) {

    }

    async ngOnInit() {
        this.loadProjects();
    }

    async onRemoveClick(project: SavedProject) {
        const confirmed = await this.dialogService.showConfirmation("Are you sure?", `Do you really want to delete project '${project.project.name}'?`);
        if (!confirmed)
            return;

        await this.projectService.delete(project);
        this.loadProjects();
    }

    private async loadProjects() {
        const currentUser = await this.signInService.currentUser;
        this.projects = await this.projectService.get(currentUser!.id);
        this.projects.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    }
}
