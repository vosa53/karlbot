import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TownViewComponent } from './presentation/components/town-view/town-view.component';
import { TownViewMoveDirective } from './presentation/directives/town-view-move.directive';
import { TownViewSelectDirective } from './presentation/directives/town-view-select.directive';
import { ValidatedInputDirective } from './presentation/directives/validated-input.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './presentation/components/message-dialog/message-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { PromptDialogComponent } from './presentation/components/prompt-dialog/prompt-dialog.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective,
        MessageDialogComponent,
        PromptDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule
    ],
    exports: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective
    ]
})
export class SharedModule { }
