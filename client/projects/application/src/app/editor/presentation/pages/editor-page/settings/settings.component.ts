import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ValidatedInputDirective, ValidatedInputValidatorFactory } from "projects/application/src/app/shared/presentation/directives/validated-input.directive";
import { Settings } from "karel";
import { PanelComponent } from "../../../components/panel/panel.component";

/**
 * Editor of the project run settings.
 */
@Component({
    standalone: true,
    selector: "app-settings",
    imports: [CommonModule, ValidatedInputDirective, MatFormFieldModule, MatInputModule, MatSelectModule, PanelComponent],
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"]
})
export class SettingsComponent {
    /**
     * Settings.
     */
    @Input()
    settings: Settings = new Settings("", 0, 0);

    /**
     * Emitted when the user wants to change the settings.
     */
    @Output()
    settingsChange = new EventEmitter<Settings>();

    readonly MAX_RECURSION_DEPTH_VALIDATOR = ValidatedInputValidatorFactory.integer(i => i > 0 && i <= 100_000);

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
