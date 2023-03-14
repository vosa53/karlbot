import { Routes } from '@angular/router';

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
        loadChildren: () => import("./projects/projects.routes").then(m => m.projectsRoutes)
    },
    {
        path: "challenges",
        loadChildren: () => import("./challenges/challenges.routes").then(m => m.challengesRoutes)
    },
    {
        path: "user",
        loadChildren: () => import("./user/user.routes").then(m => m.userRoutes)
    }
];

