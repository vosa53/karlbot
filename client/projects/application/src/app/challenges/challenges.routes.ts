import { Routes } from "@angular/router";
import { authenticatedCanActivate } from "../shared/application/route-guards/authenticated-can-activate";
import { ChallengeEditorPageComponent } from "./presentation/pages/challenge-editor-page/challenge-editor-page.component";
import { ChallengePageComponent } from "./presentation/pages/challenge-page/challenge-page.component";
import { ChallengesPageComponent } from "./presentation/pages/challenges-page/challenges-page.component";

/**
 * Routes concerning the challenges module.
 */
export const challengesRoutes: Routes = [
    {
        path: "",
        component: ChallengesPageComponent
    },
    {
        path: "editor",
        component: ChallengeEditorPageComponent,
        canActivate: [authenticatedCanActivate(true)]
    },
    {
        path: "editor/:id",
        component: ChallengeEditorPageComponent,
        canActivate: [authenticatedCanActivate(true)]
    },
    {
        path: ":id",
        component: ChallengePageComponent
    }
];
