import { Directive, HostListener } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appStopClickPropagation]'
})
export class StopClickPropagationDirective {
    @HostListener("click", ["$event"])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }
}
