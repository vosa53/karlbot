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
import { Project, ProjectDeserializer, ProjectSerializer, Vector } from 'projects/karel/src/public-api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { SavedProject } from 'projects/application/src/app/shared/application/models/saved-project';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { ChallengeSubmissionComponent } from './challenge-submission/challenge-submission.component';
import { ChallengeTestCase } from 'projects/application/src/app/shared/application/models/challenge-test-case';
import { TownViewComponent } from 'projects/application/src/app/shared/presentation/components/town-view/town-view.component';
import { TownCamera } from 'projects/application/src/app/shared/presentation/town/town-camera';
import { MarkdownDirective } from 'projects/application/src/app/shared/presentation/directives/markdown-directive';
import { ChallengeDifficultyComponent } from '../../components/challenge-difficulty/challenge-difficulty.component';
import { NotificationService } from 'projects/application/src/app/shared/presentation/services/notification.service';
import { User } from 'projects/application/src/app/shared/application/models/user';
import { TownViewFitContainDirective } from 'projects/application/src/app/shared/presentation/directives/town-view-fit-contain.directive';
import party from "party-js";
import { ChallengeStatusComponent } from '../../components/challenge-status/challenge-status.component';

@Component({
    selector: 'app-challenge-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, PageComponent, ChallengeSubmissionComponent, TownViewComponent, MarkdownDirective, ChallengeDifficultyComponent, TownViewFitContainDirective, ChallengeStatusComponent],
    templateUrl: './challenge-page.component.html',
    styleUrls: ['./challenge-page.component.css']
})
export class ChallengePageComponent {
    challenge: Challenge | null = null;
    challengeTestCases: ChallengeTestCase[] = [];
    challengeSubmissions: ChallengeSubmission[] = [];

    constructor(private readonly challengeService: ChallengeService, private readonly challengeSubmissionService: ChallengeSubmissionService,
        private readonly projectService: ProjectService, private readonly signInService: SignInService,
        private readonly activatedRoute: ActivatedRoute, private bottomSheet: MatBottomSheet, private notificationService: NotificationService) {

    }

    async ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async p => {
            await this.loadChallenge();
        });
    }

    async onSubmitProject() {
        const currentUser = await firstValueFrom(this.signInService.currentUser$);
        const project = await this.selectProject(currentUser!);
        if (project === null)
            return;

        const submission: ChallengeSubmission = {
            id: null,
            userId: currentUser!.id,
            created: new Date(),
            project: project,
            evaluationResult: null
        }
        const result = await this.challengeSubmissionService.add(this.challenge!.id!, submission);
        
        if (result.evaluationResult !== null) {
            const isSuccess = result.evaluationResult.successRate === 1;
            
            if (isSuccess) {
                for (let i = 0; i < 3; i++)
                party.confetti(document.body, {
                    count: party.variation.range(20, 40),
                    size: party.variation.range(1.4, 1.8)
                });
            }
            
            const message = isSuccess ? "Success! Good job 👍" : "Not now :( Try again!";
            this.notificationService.show(message);
        }
        
        await this.loadChallenge();
    }

    private async loadChallenge() {
        const id = this.activatedRoute.snapshot.paramMap.get("id")!;
        const currentUser = await firstValueFrom(this.signInService.currentUser$);

        this.challenge = await this.challengeService.getById(id);
        this.challengeTestCases = this.challenge.testCases!.filter(tc => tc.isPublic);
        this.challengeSubmissions = await this.challengeSubmissionService.get(this.challenge!.id!, currentUser!.id);
        this.challengeSubmissions.sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    private async selectProject(currentUser: User): Promise<Project | null> {
        const savedProjects = await this.projectService.get(currentUser.id);
        savedProjects.sort((a, b) => b.modified.getTime() - a.modified.getTime());
        const bottomSheet = this.bottomSheet.open<ProjectSelectorComponent, SavedProject[], SavedProject>(ProjectSelectorComponent, { data: savedProjects });
        const result = await lastValueFrom(bottomSheet.afterDismissed());

        return result?.project ?? null;
    }
}
