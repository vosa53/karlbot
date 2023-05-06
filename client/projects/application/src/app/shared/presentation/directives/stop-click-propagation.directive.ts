import { Directive, HostListener } from "@angular/core";

/**
 * Stops click event propagation at the element where the directive is applied.
 */
@Directive({
    standalone: true,
    selector: "[appStopClickPropagation]"
})
export class StopClickPropagationDirective {
    @HostListener("click", ["$event"])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }
}
