import { Routes } from "@angular/router";
import { ChallengeEditorPageComponent } from "./presentation/pages/challenge-editor-page/challenge-editor-page.component";
import { ChallengePageComponent } from "./presentation/pages/challenge-page/challenge-page.component";
import { ChallengesPageComponent } from "./presentation/pages/challenges-page/challenges-page.component";

export const challengesRoutes: Routes = [
    {
        path: "",
        component: ChallengesPageComponent
    },
    {
        path: "editor",
        component: ChallengeEditorPageComponent
    },
    {
        path: "editor/:id",
        component: ChallengeEditorPageComponent
    },
    {
        path: ":id",
        component: ChallengePageComponent
    }
];
