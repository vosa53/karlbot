import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Challenge } from "projects/application/src/app/shared/application/models/challenge";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PageComponent } from "projects/application/src/app/shared/presentation/components/page/page.component";
import { DialogService } from "projects/application/src/app/shared/presentation/services/dialog.service";
import { ChallengeDifficultyComponent } from "../../components/challenge-difficulty/challenge-difficulty.component";
import { SignInService } from "projects/application/src/app/shared/application/services/sign-in.service";
import { ChallengeDifficulty } from "projects/application/src/app/shared/application/models/challenge-difficulty";
import { firstValueFrom } from "rxjs";
import { ChallengeStatusComponent } from "../../components/challenge-status/challenge-status.component";
import { ChallengeService } from "projects/application/src/app/shared/application/services/api/challenge.service";

@Component({
    selector: "app-challenges-page",
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTableModule, PageComponent, ChallengeDifficultyComponent, ChallengeStatusComponent],
    templateUrl: "./challenges-page.component.html",
    styleUrls: ["./challenges-page.component.css"]
})
export class ChallengesPageComponent implements OnInit {
    challenges: Challenge[] | null = null;
    displayedColumns: string[] = ["status", "name", "difficulty", "solved"];

    constructor(
        private readonly challengeService: ChallengeService, 
        private readonly dialogService: DialogService, 
        readonly signInService: SignInService
    ) { }

    async ngOnInit() {
        const currentUser = await firstValueFrom(this.signInService.currentUser$);
        if (currentUser!.isAdmin)
            this.displayedColumns.push("actions");

        await this.loadChallenges();
    }

    async onRemoveClick(challenge: Challenge) {
        const confirmed = await this.dialogService.showConfirmation("Are you sure?", `Do you really want to delete challenge '${challenge.name}'?`);
        if (!confirmed)
            return;

        await this.challengeService.delete(challenge);
        await this.loadChallenges();
    }

    private async loadChallenges() {
        this.challenges = await this.challengeService.get();
        this.challenges.sort((a, b) => {
            const byDifficulty = this.getDifficultySortOrder(a.difficulty) - this.getDifficultySortOrder(b.difficulty);
            if (byDifficulty !== 0) return byDifficulty;

            return a.name.localeCompare(b.name, "en");
        });
    }

    private getDifficultySortOrder(difficulty: ChallengeDifficulty) {
        if (difficulty === ChallengeDifficulty.easy)
            return 0;
        else if (difficulty === ChallengeDifficulty.medium)
            return 1;
        else if (difficulty === ChallengeDifficulty.hard)
            return 2;
        else
            throw new Error();
    }
}
