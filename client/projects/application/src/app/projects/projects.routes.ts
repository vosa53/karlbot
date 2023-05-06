import { Routes } from "@angular/router";
import { ProjectsPageComponent } from "./presentation/pages/projects-page/projects-page.component";

/**
 * Routes concerning the projects module.
 */
export const projectsRoutes: Routes = [
    {
        path: "",
        component: ProjectsPageComponent
    }
];
