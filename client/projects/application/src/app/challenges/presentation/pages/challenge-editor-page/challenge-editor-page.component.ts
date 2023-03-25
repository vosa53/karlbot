import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Challenge } from 'projects/application/src/app/shared/application/models/challenge';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from 'projects/application/src/app/shared/application/services/challenge.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { MutableTown } from 'projects/karel/src/public-api';
import { EditorChallengeTestCase } from './editor-challenge-test-case';
import { MatIconModule } from '@angular/material/icon';
import { ChallengeTestCaseEditorComponent } from './challenge-test-case-editor/challenge-test-case-editor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StopClickPropagationDirective } from 'projects/application/src/app/shared/presentation/directives/stop-click-propagation.directive';
import { DialogService } from 'projects/application/src/app/shared/presentation/services/dialog.service';
import { MatSelectModule } from '@angular/material/select';
import { ChallengeDifficulty } from 'projects/application/src/app/shared/application/models/challenge-difficulty';
import { ChallengeDifficultyComponent } from '../../components/challenge-difficulty/challenge-difficulty.component';

@Component({
    selector: 'app-challenge-editor-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, PageComponent, MatIconModule, ChallengeTestCaseEditorComponent, MatExpansionModule, MatCheckboxModule, StopClickPropagationDirective, MatSelectModule],
    templateUrl: './challenge-editor-page.component.html',
    styleUrls: ['./challenge-editor-page.component.css']
})
export class ChallengeEditorPageComponent {
    form = new FormGroup({
        name: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        difficulty: new FormControl(ChallengeDifficulty.easy, Validators.required)
    });

    challenge: Challenge | null = null;
    testCases: EditorChallengeTestCase[] = [];

    constructor(private readonly challengeService: ChallengeService, private readonly activatedRoute: ActivatedRoute, 
        private readonly router: Router, private readonly dialogService: DialogService) {

    }

    async ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async p => {
            const idText = p.get("id");
            if (idText !== null) {
                const id = parseInt(idText, 10);
                const challenge = await this.challengeService.getById(id);
                this.setChallenge(challenge);
            }
            else
                this.setChallenge(null);
        });
    }

    async onSubmit() {
        const challenge = this.getChallenge();
        if (this.challenge === null)
            this.challenge = await this.challengeService.add(challenge);
        else
            await this.challengeService.update(challenge);

        this.router.navigateByUrl(`/challenges/${this.challenge.id}`);
    }

    onAddTestCase() {
        const newTestCase: EditorChallengeTestCase = {
            inputTown: MutableTown.createEmpty(10, 10),
            outputTown: MutableTown.createEmpty(10, 10),
            checkKarelPosition: true,
            checkKarelDirection: true,
            checkSigns: true,
            isPublic: false
        };
        this.testCases.push(newTestCase);
    }

    async onRemoveTestCase(testCase: EditorChallengeTestCase) {
        const index = this.testCases.indexOf(testCase);
        const confirmed = await this.dialogService.showConfirmation("Are you sure?", `Do you really want to delete test case '${this.getTestCaseName(index)}'?`);
        if (!confirmed)
            return;

        this.testCases.splice(index, 1);
    }

    onTestCaseChange(oldValue: EditorChallengeTestCase, newValue: EditorChallengeTestCase) {
        const index = this.testCases.indexOf(oldValue);
        if (index === -1)
            return;

        this.testCases[index] = newValue;
    }

    onChangeIsPublic(testCase: EditorChallengeTestCase, isPublic: boolean) {
        const newTestCase = { ...testCase, isPublic };
        this.onTestCaseChange(testCase, newTestCase);
    }

    trackTestCase(index: number, element: any): number {
        return index;
    }

    getTestCaseName(testCaseIndex: number) {
        return "Test case " + (testCaseIndex + 1);
    }

    private getChallenge(): Challenge {
        return {
            id: this.challenge?.id ?? 0,
            name: this.form.value.name!,
            description: this.form.value.description!,
            difficulty: this.form.value.difficulty!,
            testCases: this.testCases.map(tc => ({
                inputTown: tc.inputTown.toImmutable(),
                outputTown: tc.outputTown.toImmutable(),
                checkKarelPosition: tc.checkKarelPosition,
                checkKarelDirection: tc.checkKarelDirection,
                checkSigns: tc.checkSigns,
                isPublic: tc.isPublic
            }))
        };
    }

    private setChallenge(challenge: Challenge | null) {
        if (challenge === null) {
            this.challenge = null;
            this.testCases = [];
            this.form.reset();
            return;
        }

        this.challenge = challenge;
        this.form.patchValue({
            name: challenge.name,
            description: challenge.description,
            difficulty: challenge.difficulty
        });
        this.testCases = challenge.testCases!.map(tc => ({
            inputTown: tc.inputTown.toMutable(),
            outputTown: tc.outputTown.toMutable(),
            checkKarelPosition: tc.checkKarelPosition,
            checkKarelDirection: tc.checkKarelDirection,
            checkSigns: tc.checkSigns,
            isPublic: tc.isPublic
        }));
    }
}
