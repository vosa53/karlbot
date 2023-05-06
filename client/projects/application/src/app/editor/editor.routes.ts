import { Routes } from "@angular/router";
import { EditorPageComponent } from "./presentation/pages/editor-page/editor-page.component";

/**
 * Routes concerning the editor module.
 */
export const editorRoutes: Routes = [
    { 
        path: "", 
        component: EditorPageComponent
    },
    {
        path: ":id",
        component: EditorPageComponent
    }
];
