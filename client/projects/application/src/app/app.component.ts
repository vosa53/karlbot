import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { ColorTheme, ColorThemeService } from './shared/application/services/color-theme.service';

@Component({
    selector: "app-root",
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private colorThemeSubscription: Subscription | null = null;

    constructor(readonly colorThemeService: ColorThemeService) { }

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
