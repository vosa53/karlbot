import { Event } from "../event";

/**
 * Token that can be used to signal that an interpretation is to be stopped.
 */
export class InterpretStopToken {
    /**
     * Whether stop is requested.
     */
    get isStopRequested(): boolean {
        return this._isStopRequested;
    }

    /**
     * Event when stop is requested.
     */
    readonly stopRequested = new Event();

    private _isStopRequested = false;
    
    /**
     * Requests stop. Can be called at most once, otherwise throws an error.
     */
    stop() {
        if (this.isStopRequested)
            throw new Error("Stop can be requested at most once.");
            
        this._isStopRequested = true;
        this.stopRequested.emit();
    }
}