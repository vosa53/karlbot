import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Challenge } from 'projects/application/src/app/shared/application/models/challenge';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from 'projects/application/src/app/shared/application/services/challenge.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';

@Component({
    selector: 'app-challenge-editor-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, PageComponent],
    templateUrl: './challenge-editor-page.component.html',
    styleUrls: ['./challenge-editor-page.component.css']
})
export class ChallengeEditorPageComponent {
    form = new FormGroup({
        name: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        evaluationCode: new FormControl("", Validators.required)
    });

    challenge: Challenge | null = null;

    constructor(private readonly challengeService: ChallengeService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {

    }

    async ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async p => {
            const idText = p.get("id");
            if (idText !== null) {
                const id = parseInt(idText, 10);
                this.challenge = await this.challengeService.getById(id);
                this.form.patchValue({
                    name: this.challenge.name,
                    description: this.challenge.description,
                    evaluationCode: this.challenge.evaluationCode
                });
            }
            else {
                this.challenge = null;
                this.form.reset();
            }
        });
    }

    async onSubmit() {
        if (this.challenge === null) {
            const challenge: Challenge = {
                id: 0,
                name: this.form.value.name!,
                description: this.form.value.description!,
                evaluationCode: this.form.value.evaluationCode!
            };
            this.challenge = await this.challengeService.add(challenge);
        }
        else {
            const challenge: Challenge = {
                ...this.challenge,
                name: this.form.value.name!,
                description: this.form.value.description!,
                evaluationCode: this.form.value.evaluationCode!
            };
            await this.challengeService.update(challenge);
        }

        this.router.navigateByUrl(`/challenges/${this.challenge.id}`);
    }
}
