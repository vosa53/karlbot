import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChallengeSubmissionsInfo } from "projects/application/src/app/shared/application/models/challenge-submissions.info";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-challenge-status",
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: "./challenge-status.component.html",
    styleUrls: ["./challenge-status.component.css"]
})
export class ChallengeStatusComponent {
    @Input()
    submissionsInfo: ChallengeSubmissionsInfo | null = null;

    get status() {
        if (this.submissionsInfo === null)
            return "none";
        else if (this.submissionsInfo.ownSuccessfulSubmissionCount !== 0)
            return "done";
        else if (this.submissionsInfo.ownSubmissionCount !== 0)
            return "attempted";
        else
            return "none";
    }
}
