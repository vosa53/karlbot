import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from 'projects/application/src/app/shared/application/services/challenge.service';
import { ChallengeSubmissionService } from 'projects/application/src/app/shared/application/services/challenge-submission-service';
import { ProjectService } from 'projects/application/src/app/shared/application/services/project.service';
import { Challenge } from 'projects/application/src/app/shared/application/models/challenge';
import { ChallengeSubmission } from 'projects/application/src/app/shared/application/models/challenge-submission';
import { SignInService } from 'projects/application/src/app/shared/application/services/sign-in.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProjectSelectorComponent } from './project-selector/project-selector.component';
import { Project, ProjectDeserializer, ProjectSerializer } from 'projects/karel/src/public-api';
import { lastValueFrom } from 'rxjs';
import { ChallengeSubmissionEvaluationState } from 'projects/application/src/app/shared/application/models/challenge-submission-evaluation-state';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { ChallengeSubmissionComponent } from './challenge-submission/challenge-submission.component';

@Component({
    selector: 'app-challenge-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, PageComponent, ChallengeSubmissionComponent],
    templateUrl: './challenge-page.component.html',
    styleUrls: ['./challenge-page.component.css']
})
export class ChallengePageComponent {
    challenge: Challenge | null = null;
    challengeSubmissions: ChallengeSubmission[] = [];

    constructor(private readonly challengeService: ChallengeService, private readonly challengeSubmissionService: ChallengeSubmissionService,
        private readonly projectService: ProjectService, private readonly signInService: SignInService,
        private readonly activatedRoute: ActivatedRoute, private bottomSheet: MatBottomSheet) {

    }

    async ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async p => {
            const currentUserId = (await this.signInService.currentUser)!.id;
            const idText = p.get("id")!;
            const id = parseInt(idText, 10);

            this.challenge = await this.challengeService.getById(id);
            this.challengeSubmissions = await this.challengeSubmissionService.get(id, currentUserId);
        });
    }

    async onSubmitProject() {
        const project = await this.selectProject();
        if (project === null)
            return;

        const currentUser = await this.signInService.currentUser;
        const submission: ChallengeSubmission = {
            id: 0,
            userId: currentUser!.id,
            project: project,
            evaluationState: ChallengeSubmissionEvaluationState.inProgress,
            evaluationMessage: ""
        }
        await this.challengeSubmissionService.add(this.challenge!.id, submission);
        this.challengeSubmissions = await this.challengeSubmissionService.get(this.challenge!.id, currentUser!.id);
    }

    private async selectProject(): Promise<Project | null> {
        const savedProjects = await this.projectService.get();
        const bottomSheet = this.bottomSheet.open<ProjectSelectorComponent, SavedProject[], SavedProject>(ProjectSelectorComponent, { data: savedProjects });
        const result = await lastValueFrom(bottomSheet.afterDismissed());

        return result?.project ?? null;
    }
}
