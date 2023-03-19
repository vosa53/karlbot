import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeSubmission } from 'projects/application/src/app/shared/application/models/challenge-submission';
import { Project, Settings } from 'projects/karel/src/public-api';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-challenge-submission',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatCardModule],
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
            return "Failure";
    }

    private createChallengeSubmission(): ChallengeSubmission {
        return {
            id: 0,
            userId: "",
            project: Project.create("", [], [], new Settings("", 0, 0)),
            evaluationResult: null
        };
    }
}
