import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from 'projects/application/src/app/shared/application/services/project.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-projects-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent {
    constructor(private readonly projectService: ProjectService) {

    }
}
