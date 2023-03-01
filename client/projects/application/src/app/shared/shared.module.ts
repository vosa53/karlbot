import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TownViewComponent } from './presentation/components/town-view/town-view.component';

@NgModule({
    declarations: [
        TownViewComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TownViewComponent
    ]
})
export class SharedModule { }
