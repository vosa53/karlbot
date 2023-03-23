import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge } from 'projects/application/src/app/shared/application/models/challenge';
import { ChallengeService } from 'projects/application/src/app/shared/application/services/challenge.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { DialogService } from 'projects/application/src/app/shared/presentation/services/dialog.service';

@Component({
    selector: 'app-challenges-page',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTableModule, PageComponent],
    templateUrl: './challenges-page.component.html',
    styleUrls: ['./challenges-page.component.css']
})
export class ChallengesPageComponent implements OnInit {
    challenges: Challenge[] = [];
    displayedColumns: string[] = ["name", "actions"];

    constructor(private readonly challengeService: ChallengeService, private readonly dialogService: DialogService) {

    }

    async ngOnInit() {
        this.loadChallenges();
    }

    async onRemoveClick(challenge: Challenge) {
        const confirmed = await this.dialogService.showConfirmation("Are you sure?", `Do you really want to delete challenge '${challenge.name}'?`);
        if (!confirmed)
            return;

        await this.challengeService.delete(challenge);
        this.loadChallenges();
    }

    private async loadChallenges() {
        this.challenges = await this.challengeService.get();
    }
}
