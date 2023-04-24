import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeSubmission } from 'projects/application/src/app/shared/application/models/challenge-submission';
import { Project, Settings } from "karel";
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DateAgoPipe } from 'projects/application/src/app/shared/presentation/pipes/date-ago.pipe';

@Component({
    selector: 'app-challenge-submission',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatCardModule, DateAgoPipe],
    templateUrl: './challenge-submission.component.html',
    styleUrls: ['./challenge-submission.component.css']
})
export class ChallengeSubmissionComponent {
    @Input()
    challengeSubmission: ChallengeSubmission = this.createChallengeSubmission();

    get evaluationStateText(): string {
        if (this.challengeSubmission.evaluationResult === null)
            return "In progress...";
        else if (this.challengeSubmission.evaluationResult.successRate === 1)
            return "Success";
        else
            return `Failure (${Math.round(this.challengeSubmission.evaluationResult.successRate * 10000) / 100} %)`;
    }

    private createChallengeSubmission(): ChallengeSubmission {
        return {
            id: null,
            userId: "",
            created: new Date(),
            project: Project.create("", [], [], new Settings("", 0, 0)),
            evaluationResult: null
        };
    }
}
