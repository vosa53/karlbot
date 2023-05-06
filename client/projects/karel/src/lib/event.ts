/**
 * Event.
 */
export class Event {
    private readonly listeners: (() => void)[] = [];

    /**
     * Emits the event.
     */
    emit() {
        for (const listener of this.listeners)
            listener();
    }

    /**
     * Adds a listener.
     * @param listener Listener to add.
     */
    addListener(listener: () => void) {
        this.listeners.push(listener);
    }

    /**
     * Removes a listener.
     * @param listener Listener to remove.
     */
    removeListener(listener: () => void) {
        const index = this.listeners.indexOf(listener);
        if (index === -1)
            return;

        this.listeners.splice(index, 1);
    }
}