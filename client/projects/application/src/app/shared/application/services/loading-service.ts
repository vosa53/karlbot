import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService implements OnDestroy {
    private readonly loadingCount = new BehaviorSubject(0);
    readonly isLoading$ = this.loadingCount.pipe(map(c => c > 0));

    private readonly routerEventsSubscription: Subscription | null = null;

    constructor(private readonly router: Router) { 
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart)
                this.addLoading();
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
                this.removeLoading();
        });
    }

    addLoading() {
        this.loadingCount.next(this.loadingCount.value + 1);
    }

    removeLoading() {
        this.loadingCount.next(this.loadingCount.value - 1);
    }

    ngOnDestroy(): void {
        this.routerEventsSubscription?.unsubscribe();
    }
}
