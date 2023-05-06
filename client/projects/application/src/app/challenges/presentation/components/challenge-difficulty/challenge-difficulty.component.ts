import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChallengeDifficulty } from "projects/application/src/app/shared/application/models/challenge-difficulty";

/**
 * Challenge difficulty text.
 */
@Component({
    selector: "app-challenge-difficulty",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./challenge-difficulty.component.html",
    styleUrls: ["./challenge-difficulty.component.css"]
})
export class ChallengeDifficultyComponent {
    /**
     * Challenge difficulty.
     */
    @Input()
    difficulty = ChallengeDifficulty.easy;
}
