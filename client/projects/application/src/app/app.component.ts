import { Component } from '@angular/core';
import { KarelService } from 'karel';


@Component({
    selector: "app-root",
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = KarelService.pes();
}
