/**
 * Token signaling stop of interpretation.
 */
export class InterpretStopToken {
    /**
     * Whether stop is requested.
     */
    get isStopRequested(): boolean {
        return this._isStopRequested;
    }

    private _isStopRequested = false;
    
    /**
     * Requests stop. Can be called at most once, otherwise throws an error.
     */
    stop() {
        if (this.isStopRequested)
            throw new Error("Stop can be requested at most once.");
            
        this._isStopRequested = true;
    }
}