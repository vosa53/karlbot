import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./editor/editor.module").then(m => m.EditorModule)
    },
    {
        path: "projects",
        loadChildren: () => import("./projects/projects.module").then(m => m.ProjectsModule)
    },
    {
        path: "challenges",
        loadChildren: () => import("./challenges/challenges.module").then(m => m.ChallengesModule)
    },
    {
        path: "user",
        loadChildren: () => import("./user/user.module").then(m => m.UserModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
