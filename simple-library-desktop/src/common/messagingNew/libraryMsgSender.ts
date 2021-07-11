import {AbstractMsgSender} from "./abstractMsgSender";
import {LastOpenedLibraryEntry} from "../commonModels";
import {IpcWrapper} from "./msgUtils";

export class LibraryMsgSender extends AbstractMsgSender {

	constructor(ipcWrapper: IpcWrapper) {
		super("library", ipcWrapper);
	}

	public getLastOpened(): Promise<LastOpenedLibraryEntry[]> {
		return this.send("last_opened")
			.then((response => {
				return [];
			}))
	}



}