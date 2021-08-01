import {getBrowserWindow, IpcWrapper} from "./ipcWrapper";
import {MsgTraceId} from "./msgTraceId";
import {MsgDefaultEntity, MsgEntity, MsgErrorEntity} from "./msgEntity";
import {BrowserWindow} from "electron";

export type MsgHandler<SEND, RECEIVE> = (payload: SEND, traceId: string) => RECEIVE | Promise<RECEIVE>

export class Channel<SEND, RECEIVE> {

	private readonly shouldLogPayload: boolean;
	private readonly id: string;
	private readonly ipcWrapper: IpcWrapper;

	private readonly noopHandler: MsgHandler<SEND, RECEIVE> = () => undefined;
	private handler: MsgHandler<SEND, RECEIVE> = this.noopHandler;

	private shouldVoidResult: boolean = false;

	constructor(id: string, ipcWrapper: IpcWrapper, logPayload: boolean) {
		this.id = id;
		this.ipcWrapper = ipcWrapper;
		this.shouldLogPayload = logPayload;
		this.setupListener();
	}

	protected setShouldVoidResult(shouldVoidResult: boolean): void {
		this.shouldVoidResult = shouldVoidResult;
	}

	private setupListener() {
		switch (this.ipcWrapper.process) {
			case "main": {
				this.ipcWrapper.ipcMain.answerRenderer(this.id, (msgEntity: MsgEntity, window: BrowserWindow) => {
					if (!MsgEntity.isError(msgEntity)) {
						return this.handleRequest(msgEntity as MsgDefaultEntity, window);
					}
				});
				break;
			}
			case "worker":
			case "renderer": {
				this.ipcWrapper.ipcRenderer.answerMain(this.id, (msgEntity: MsgEntity) => {
					if (!MsgEntity.isError(msgEntity)) {
						return this.handleRequest(msgEntity as MsgDefaultEntity, null);
					}
				});
				break;
			}
		}
	}

	public send(payload: SEND, traceId?: string): Promise<RECEIVE> {
		const msgTraceId = !!traceId ? traceId : MsgTraceId.gen();
		console.debug(this.logHeader(msgTraceId, "out"), "send", this.logPayload(payload));
		switch (this.ipcWrapper.process) {
			case "main": {
				return this.ipcWrapper.ipcMain.callRenderer(getBrowserWindow(this.ipcWrapper), this.id, MsgEntity.entity(msgTraceId, payload))
					.then((response: MsgEntity) => this.handleResponse(response));
			}
			case "worker":
			case "renderer": {
				return this.ipcWrapper.ipcRenderer.callMain(this.id, MsgEntity.entity(msgTraceId, payload))
					.then((response: MsgEntity) => this.handleResponse(response));
			}
			default: {
				return Promise.reject("Unexpected process: " + this.ipcWrapper.process);
			}
		}

	}

	public sendAndForget(payload: SEND): Promise<void> {
		return this.send(payload).then();
	}

	public on<T extends Channel<SEND, RECEIVE>>(handler: MsgHandler<SEND, RECEIVE>): T {
		this.handler = (!!handler) ? handler : this.noopHandler;
		return (this as unknown) as T;
	}

	private handleRequest(msgEntity: MsgDefaultEntity, window: BrowserWindow): Promise<any> {
		console.debug(this.logHeader(msgEntity.traceId, "in"), "handle", this.logPayload(msgEntity.body), "from", window ? window.getTitle() : "null");
		const handlerResult: RECEIVE | Promise<RECEIVE> = this.handler(msgEntity.body, msgEntity.traceId);
		return Promise.resolve(handlerResult)
			.then((response: any) => this.shouldVoidResult ? undefined : response)
			.then((response: any) => {
				console.debug(this.logHeader(msgEntity.traceId, "in"), "answer", this.logPayload(response));
				return MsgEntity.entity(msgEntity.traceId, response);
			})
			.catch((err: any) => {
				const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
				console.debug(this.logHeader(msgEntity.traceId, "in"), "answer error", strError);
				return MsgEntity.error(msgEntity.traceId, strError);
			});
	}

	private handleResponse(responseEntity: MsgEntity): Promise<any> {
		console.debug(this.logHeader(responseEntity.traceId, "out"), "response",
			this.logPayload(MsgEntity.isError(responseEntity) ? (responseEntity as MsgErrorEntity).error : (responseEntity as MsgDefaultEntity).body));
		if (MsgEntity.isError(responseEntity)) {
			return Channel.rejectWithErrorEntity((responseEntity as MsgErrorEntity));
		} else {
			return Promise.resolve((responseEntity as MsgDefaultEntity).body);
		}
	}

	private static rejectWithErrorEntity(response: MsgErrorEntity): Promise<any> {
		return Promise.reject((response && response.error) ? response.error : JSON.stringify(response));
	}

	private logHeader(traceId: string, dir: "in" | "out"): string {
		return "(" + traceId + ")[" + (dir === "in" ? ">" : "") + this.ipcWrapper.process + "/" + this.id + (dir === "out" ? ">" : "") + "]";
	}

	private logPayload(payload: any): any {
		if (this.shouldLogPayload) {
			return payload;
		} else {
			return "<payload>";
		}
	}

}
