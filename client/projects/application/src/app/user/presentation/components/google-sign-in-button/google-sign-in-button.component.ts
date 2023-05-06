import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Google sign in button according to Google's [branding guidelines](https://developers.google.com/identity/branding-guidelines).
 */
@Component({
    selector: "app-google-sign-in-button",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./google-sign-in-button.component.html",
    styleUrls: ["./google-sign-in-button.component.css"]
})
export class GoogleSignInButtonComponent {

}
