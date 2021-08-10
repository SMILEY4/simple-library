export class EventDispatcher {

    private readonly listenerMap = new Map<string, (payload: any) => any>();

    public on(eventId: string, listener: (payload: any) => any): void {
        this.listenerMap.set(eventId, listener);
    }

    public clear(eventId: string) {
        this.listenerMap.delete(eventId);
    }

    public clearAll() {
        this.listenerMap.clear();
    }

    public handle(eventId: string, payload?: any): any {
        const listener = this.findListener(eventId);
        if (listener) {
            return listener(payload);
        } else {
            return undefined;
        }
    }

    private findListener(eventId: string): (payload: any) => any | null {
        const listener = this.listenerMap.get(eventId);
        return listener ? listener : null;
    }

}
