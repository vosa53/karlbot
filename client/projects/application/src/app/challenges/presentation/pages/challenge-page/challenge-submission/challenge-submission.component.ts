import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeSubmission } from 'projects/application/src/app/shared/application/models/challenge-submission';
import { ChallengeSubmissionEvaluationState } from 'projects/application/src/app/shared/application/models/challenge-submission-evaluation-state';
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
        const evaluationState = this.challengeSubmission.evaluationState;
        if (evaluationState === ChallengeSubmissionEvaluationState.inProgress)
            return "In progress...";
        else if (evaluationState === ChallengeSubmissionEvaluationState.success)
            return "Success";
        else if (evaluationState === ChallengeSubmissionEvaluationState.failure)
            return "Failure";
        else 
            throw new Error();
    }

    private createChallengeSubmission(): ChallengeSubmission {
        return {
            id: 0,
            userId: "",
            evaluationState: ChallengeSubmissionEvaluationState.inProgress,
            project: Project.create("", [], [], new Settings("", 0, 0)),
            evaluationMessage: "Evaluation message"
        };
    }
}
