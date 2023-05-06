import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

/**
 * Manages and persists application color theme.
 */
@Injectable({
    providedIn: "root"
})
export class ColorThemeService {
    private readonly colorTheme = new BehaviorSubject(ColorThemeService.loadColorTheme());

    /**
     * Current color theme.
     */
    readonly colorTheme$ = this.colorTheme.asObservable();

    private static readonly COLOR_THEME_LOCAL_STORAGE_KEY = "color-theme";

    /**
     * Sets the current color theme.
     * @param colorTheme Color theme.
     */
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

/**
 * Color theme.
 */
export enum ColorTheme {
    /**
     * Light.
     */
    light = "light",

    /**
     * Dark.
     */
    dark = "dark"
}
