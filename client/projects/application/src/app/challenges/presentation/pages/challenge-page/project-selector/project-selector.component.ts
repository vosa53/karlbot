import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { MatListModule } from '@angular/material/list';
import { DateAgoPipe } from 'projects/application/src/app/shared/presentation/pipes/date-ago.pipe';

@Component({
    selector: 'app-project-selector',
    standalone: true,
    imports: [CommonModule, MatListModule, DateAgoPipe],
    templateUrl: './project-selector.component.html',
    styleUrls: ['./project-selector.component.css']
})
export class ProjectSelectorComponent {
    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) readonly savedProjects: SavedProject[], private ref: MatBottomSheetRef<ProjectSelectorComponent>) { }

    onClick(savedProject: SavedProject) {
        this.ref.dismiss(savedProject);
    }
}
