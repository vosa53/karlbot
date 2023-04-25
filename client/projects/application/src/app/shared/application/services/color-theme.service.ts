import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ColorThemeService {
    private readonly colorTheme = new BehaviorSubject(ColorThemeService.loadColorTheme());
    readonly colorTheme$ = this.colorTheme.asObservable();

    private static readonly COLOR_THEME_LOCAL_STORAGE_KEY = "color-theme";

    setColorTheme(colorTheme: ColorTheme) {
        ColorThemeService.saveColorTheme(colorTheme);
        this.colorTheme.next(colorTheme);
    }

    private static loadColorTheme(): ColorTheme {
        const fromLocalStorage = localStorage.getItem(this.COLOR_THEME_LOCAL_STORAGE_KEY);
        if (fromLocalStorage !== null && (fromLocalStorage === ColorTheme.light || fromLocalStorage === ColorTheme.dark))
            return fromLocalStorage;

        const fromSystemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? ColorTheme.dark : ColorTheme.light;

        return fromSystemPreference;
    }

    private static saveColorTheme(colorTheme: ColorTheme) {
        localStorage.setItem(this.COLOR_THEME_LOCAL_STORAGE_KEY, colorTheme);
    }
}

export enum ColorTheme {
    light = "light",
    dark = "dark"
}
