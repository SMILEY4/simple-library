import {IpcWrapper} from "./msgUtils";
import {ChannelSender} from "./channelSender";
import {ChannelReader} from "./channelReader";


export class Channel<SEND, RECEIVE> {

	private readonly sender: ChannelSender<SEND, RECEIVE>;
	private readonly reader: ChannelReader<RECEIVE, SEND>;

	constructor(id: string, ipcWrapper: IpcWrapper, logPayload?: boolean) {
		this.sender = new ChannelSender(id, ipcWrapper, logPayload);
		this.reader = new ChannelReader(id, ipcWrapper, logPayload);
	}

	public setIpcWrapper(ipcWrapper: IpcWrapper) {
		// todo: required when window is not available during creation
		//  => idea: ipcwrapper has windowProvider, that can be used to fetch the window when needed => use instead of "window"-field
		this.sender.setIpcWrapper(ipcWrapper);
		this.reader.setIpcWrapper(ipcWrapper);
	}

	public init<T extends Channel<SEND, RECEIVE>>(): T {
		this.sender.init();
		this.reader.init();
		return (this as unknown) as T;
	}

	public send(payload: SEND): Promise<RECEIVE> {
		return this.sender.send(payload);
	}

	public sendAndForget(payload: SEND): Promise<void> {
		return this.sender.sendAndForget(payload);
	}

	public on<T extends Channel<SEND, RECEIVE>>(handler: (payload: SEND) => RECEIVE | Promise<RECEIVE>): T {
		this.reader.setHandler(handler);
		return (this as unknown) as T;
	}

}