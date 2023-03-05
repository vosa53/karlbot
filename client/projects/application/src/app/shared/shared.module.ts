import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TownViewComponent } from './presentation/components/town-view/town-view.component';
import { TownViewMoveDirective } from './presentation/directives/town-view-move.directive';
import { TownViewSelectDirective } from './presentation/directives/town-view-select.directive';
import { ValidatedInputDirective } from './presentation/directives/validated-input.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './presentation/components/message-dialog/message-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective,
        MessageDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective
    ]
})
export class SharedModule { }
