import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent {

}
