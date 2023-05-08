import { Event } from "./event";

describe("Event", () => {
    it("emit - Calls all listeners in the order they were added.", () => {
        const calls: string[] = [];
        const event = new Event();
        event.addListener(() => calls.push("listener1"));
        event.addListener(() => calls.push("listener2"));

        event.emit();

        expect(calls).toEqual(["listener1", "listener2"]);
    });

    it("removeListener - Removes the correct listener.", () => {
        const calls: string[] = [];
        const event = new Event();
        const listener2 = () => calls.push("listener2");
        event.addListener(() => calls.push("listener1"));
        event.addListener(listener2);

        event.removeListener(listener2);
        event.emit();

        expect(calls).toEqual(["listener1"]);
    });

    it("removeListener - Removes only the first occurence of the listener.", () => {
        const calls: string[] = [];
        const event = new Event();
        const listener1 = () => calls.push("listener1");
        event.addListener(listener1);
        event.addListener(() => calls.push("listener2"));
        event.addListener(listener1);
        event.addListener(listener1);

        event.removeListener(listener1);
        event.emit();

        expect(calls).toEqual(["listener2", "listener1", "listener1"]);
    });
});
