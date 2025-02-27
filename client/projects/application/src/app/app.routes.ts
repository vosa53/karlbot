import { Routes } from "@angular/router";
import { authenticatedCanActivate } from "./shared/application/route-guards/authenticated-can-activate";
import { NotFoundPageComponent } from "./shared/presentation/pages/not-found-page/not-found-page.component";
import { UserGuidePageComponent } from "./shared/presentation/pages/user-guide-page/user-guide-page.component";

/**
 * Root application routes.
 */
export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/editor",
        pathMatch: "full"
    },
    {
        path: "editor",
        loadChildren: () => import("./editor/editor.routes").then(m => m.editorRoutes)
    },
    {
        path: "projects",
        loadChildren: () => import("./projects/projects.routes").then(m => m.projectsRoutes),
        canActivate: [authenticatedCanActivate()]
    },
    {
        path: "challenges",
        loadChildren: () => import("./challenges/challenges.routes").then(m => m.challengesRoutes),
        canActivate: [authenticatedCanActivate()]
    },
    {
        path: "user",
        loadChildren: () => import("./user/user.routes").then(m => m.userRoutes)
    },
    {
        path: "user-guide",
        component: UserGuidePageComponent
    },
    {
        path: "**",
        component: NotFoundPageComponent
    }
];
