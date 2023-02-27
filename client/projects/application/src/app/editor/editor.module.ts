import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorPageComponent } from './presentation/pages/editor-page/editor-page.component';
import { EditorRoutingModule } from './editor-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PanelComponent } from './presentation/components/panel/panel.component';
import { HeaderComponent } from './presentation/pages/editor-page/header/header.component';
import { TownEditorComponent } from './presentation/pages/editor-page/town-editor/town-editor.component';
import { CodeEditorComponent } from './presentation/pages/editor-page/code-editor/code-editor.component';
import { FileExplorerComponent } from './presentation/pages/editor-page/file-explorer/file-explorer.component';
import { SettingsComponent } from './presentation/pages/editor-page/settings/settings.component';
import { ErrorListComponent } from './presentation/pages/editor-page/error-list/error-list.component';

@NgModule({
    declarations: [
        EditorPageComponent,
        PanelComponent,
        HeaderComponent,
        TownEditorComponent,
        CodeEditorComponent,
        FileExplorerComponent,
        SettingsComponent,
        ErrorListComponent
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
        MatSlideToggleModule,
        MatIconModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatChipsModule,
        MatCardModule,
        MatMenuModule,
        MatListModule,
        MatInputModule,
        MatSelectModule,
        MatButtonToggleModule
    ]
})
export class EditorModule { }
