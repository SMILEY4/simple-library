import {LastOpenedLibraryEntry} from "../../common/commonModels";
import ElectronStore from "electron-store";

const Store = require("electron-store");

export class ConfigAccess {

	private readonly KEY_LAST_OPENED: string = "lastOpened";
	private readonly KEY_THEME: string = "theme";
	private readonly KEY_EXIFTOOL_LOCATION: string = "exiftool";

	private readonly store: ElectronStore;


	constructor() {
		this.store = new Store();
		if (!this.store.has(this.KEY_LAST_OPENED)) {
			this.store.set(this.KEY_LAST_OPENED, []);
		}
		if (!this.store.has(this.KEY_THEME)) {
			this.store.set(this.KEY_THEME, "dark");
		}
		if (!this.store.has(this.KEY_EXIFTOOL_LOCATION)) {
			this.store.set(this.KEY_EXIFTOOL_LOCATION, "");
		}
		console.log("Created config store at ", this.store.path);
	}

	public getLastOpened(): LastOpenedLibraryEntry[] {
		const data: any = this.store.get(this.KEY_LAST_OPENED);
		return (data ? data : []).map((entry: any) => ({name: entry.name, path: entry.path}));
	}

	public setLastOpened(entries: LastOpenedLibraryEntry[]): void {
		this.store.set(this.KEY_LAST_OPENED, entries);
	}

	public addLastOpened(name: string, path: string): void {
		try {
			let lastOpened: LastOpenedLibraryEntry[] = this.getLastOpened();
			if (lastOpened) {
				lastOpened = lastOpened.filter((e: any) => e.path != path);
				lastOpened = [{name: name, path: path}, ...lastOpened];
				lastOpened = lastOpened.slice(0, Math.min(lastOpened.length, 3));
			} else {
				lastOpened = [{name: name, path: path}];
			}
			this.setLastOpened(lastOpened);
		} catch (err) {
		}
	}

}