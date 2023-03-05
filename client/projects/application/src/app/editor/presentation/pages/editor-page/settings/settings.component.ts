import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ValidatedInputValidatorFactory } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";
import { Settings } from "projects/karel/src/lib/project/settings";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"]
})
export class SettingsComponent {
    @Input()
    settings: Settings = new Settings("", 0, 0);

    @Output()
    settingsChange = new EventEmitter<Settings>();

    readonly maxRecursionDepthValidator = ValidatedInputValidatorFactory.integer(i => i > 0);

    onKarelSpeedChange(karelSpeedText: string) {
        const karelSpeed = window.parseInt(karelSpeedText, 10);
        const newSettings = this.settings.withKarelSpeed(karelSpeed);

        this.settingsChange.emit(newSettings);
    }

    onMaxRecursionDepthChange(maxRecursionDepthText: string) {
        const maxRecursionDepth = window.parseInt(maxRecursionDepthText, 10);
        const newSettings = this.settings.withMaxRecursionDepth(maxRecursionDepth);
        
        this.settingsChange.emit(newSettings);
    }
}
