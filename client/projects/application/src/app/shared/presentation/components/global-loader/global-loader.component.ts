import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingService } from "../../../application/services/loading-service";

/**
 * Displays a loading indicator over the screen according to information from {@link LoadingService}.
 */
@Component({
    selector: "app-global-loader",
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    templateUrl: "./global-loader.component.html",
    styleUrls: ["./global-loader.component.css"]
})
export class GlobalLoaderComponent {
    constructor(readonly loadingService: LoadingService) { }
}
