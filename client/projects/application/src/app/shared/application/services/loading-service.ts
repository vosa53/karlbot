import { Injectable, OnDestroy } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { BehaviorSubject, map, Subscription } from "rxjs";

/**
 * Manages application loading state.
 */
@Injectable({
    providedIn: "root"
})
export class LoadingService implements OnDestroy {
    private readonly loadingCount = new BehaviorSubject(0);
    
    /**
     * Whether something is currently loading.
     */
    readonly isLoading$ = this.loadingCount.pipe(map(c => c > 0));

    private readonly routerEventsSubscription: Subscription | null = null;

    /**
     * @param router Router. 
     */
    constructor(private readonly router: Router) { 
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart)
                this.addLoading();
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
                this.removeLoading();
        });
    }

    /**
     * Adds a loading action.
     */
    addLoading() {
        this.loadingCount.next(this.loadingCount.value + 1);
    }

    /**
     * Removes a loading action.
     */
    removeLoading() {
        this.loadingCount.next(this.loadingCount.value - 1);
    }

    ngOnDestroy(): void {
        this.routerEventsSubscription?.unsubscribe();
    }
}
