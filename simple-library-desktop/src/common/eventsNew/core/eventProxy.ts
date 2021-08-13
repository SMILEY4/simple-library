import {EventBroadcaster} from "./eventBroadcaster";
import {EventConsumer} from "./eventConsumer";
import {EventBroadcasterConfig, EventConsumerConfig} from "./event";

export class EventProxy {

    private readonly broadcaster: EventBroadcaster;
    private readonly consumer: EventConsumer;

    private listenerAll: ((eventId: string, payload: any) => void) | null = null;
    private readonly listenerMap: Map<string, ((payload: any) => void)> = new Map();

    constructor(configConsumer: EventConsumerConfig, configBroadcaster: EventBroadcasterConfig) {
        this.consumer = new EventConsumer(configConsumer);
        this.broadcaster = new EventBroadcaster(configBroadcaster);
        this.consumer.onAll((eventId: string, event: any) => this.proxyEvent(eventId, event))
    }

    private proxyEvent(eventId: string, event: any): any {
        if (this.listenerMap.has(eventId)) {
            this.listenerMap.get(eventId)(event);
        } else if (this.listenerAll) {
            this.listenerAll(eventId, event)
        }
        return this.broadcaster.send(eventId, event)
    }

    public onAll<REQ, RES>(listener: (eventId: string, payload: REQ) => RES | Promise<RES>) {
        this.listenerAll = listener
    }

    public on<REQ, RES>(eventId: string, listener: (payload: REQ) => RES | Promise<RES>) {
        this.listenerMap.set(eventId, listener)
    }

    public clearAll() {
        this.listenerAll = null;
        this.listenerMap.clear();
    }

    public clear(eventId: string) {
        this.listenerMap.delete(eventId);
    }

}
