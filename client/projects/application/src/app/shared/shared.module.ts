import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TownViewComponent } from './presentation/components/town-view/town-view.component';
import { TownViewMoveDirective } from './presentation/directives/town-view-move.directive';
import { TownViewSelectDirective } from './presentation/directives/town-view-select.directive';
import { ValidatedInputDirective } from './presentation/directives/validated-input.directive';

@NgModule({
    declarations: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TownViewComponent,
        TownViewMoveDirective,
        TownViewSelectDirective,
        ValidatedInputDirective
    ]
})
export class SharedModule { }
