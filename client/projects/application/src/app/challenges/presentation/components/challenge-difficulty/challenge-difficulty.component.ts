import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeDifficulty } from 'projects/application/src/app/shared/application/models/challenge-difficulty';

@Component({
    selector: 'app-challenge-difficulty',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './challenge-difficulty.component.html',
    styleUrls: ['./challenge-difficulty.component.css']
})
export class ChallengeDifficultyComponent {
    @Input()
    difficulty = ChallengeDifficulty.easy;

    getText(): string {
        if (this.difficulty === ChallengeDifficulty.easy)
            return "Easy";
        if (this.difficulty === ChallengeDifficulty.medium)
            return "Medium";
        if (this.difficulty === ChallengeDifficulty.hard)
            return "Hard";
        else
            throw new Error();
    }

    getColor(): string {
        if (this.difficulty === ChallengeDifficulty.easy)
            return "#8BC34A";
        if (this.difficulty === ChallengeDifficulty.medium)
            return "#FFB300";
        if (this.difficulty === ChallengeDifficulty.hard)
            return "#D32F2F";
        else
            throw new Error();
    }
}
