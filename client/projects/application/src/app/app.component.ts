import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './shared/application/services/authentication.service';
import { ColorTheme, ColorThemeService } from './shared/application/services/color-theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: "app-root",
    imports: [CommonModule, RouterModule, MatSlideToggleModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private colorThemeSubscription: Subscription | null = null;

    constructor(readonly colorThemeService: ColorThemeService, readonly authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.colorThemeSubscription = this.colorThemeService.colorTheme$.subscribe(ct => {
            document.body.classList.toggle("light-theme", ct === ColorTheme.light);
            document.body.classList.toggle("dark-theme", ct === ColorTheme.dark);
        });
    }

    ngOnDestroy() {
        this.colorThemeSubscription?.unsubscribe();
    }

    onColorThemeChange(checked: boolean) {
        const colorTheme = checked ? ColorTheme.dark : ColorTheme.light;
        this.colorThemeService.setColorTheme(colorTheme);
    }
}
