import ElectronStore from "electron-store";

const Store = require("electron-store");

export module ConfigKey {
	export const LAST_OPENED: string = "lastOpened";
	export const THEME: string = "theme";
	export const EXIFTOOL_LOCATION: string = "exiftool";
}


export class ConfigAccess {

	private store: ElectronStore;

	constructor() {
		this.initStore();
	}

	private initStore() {
		this.store = new Store();
		if (!this.store.has(ConfigKey.LAST_OPENED)) {
			this.store.set(ConfigKey.LAST_OPENED, []);
		}
		if (!this.store.has(ConfigKey.THEME)) {
			this.store.set(ConfigKey.THEME, "dark");
		}
		if (!this.store.has(ConfigKey.EXIFTOOL_LOCATION)) {
			this.store.set(ConfigKey.EXIFTOOL_LOCATION, "");
		}
		console.log("Created config store at ", this.store.path);
	}

	/**
	 * Get the absolute path of the config file
	 */
	public getConfigFileLocation(): string {
		return this.store.path;
	}

	/**
	 * Get the configured value by the given key or return the given default value if the key does not exist
	 */
	public getValueOr<T>(key: string, defaultValue: T): T {
		const data: any = this.getStoreValue(key);
		if (data !== null && data !== undefined) {
			return data;
		} else {
			return defaultValue;
		}
	}

	private getStoreValue(key: string): any {
		return this.store.get(key);
	}

	/**
	 * Set the config value of the given key to the given value
	 */
	public setValue<T>(key: string, value: T): void {
		this.store.set(key, value);
	}

	/**
	 * Add the given value to the array with the given key. If the key does not exist, it will be created
	 */
	public addValue<T>(key: string, entry: T): void {
		const arr: T[] = this.getValueOr(key, []);
		if (!arr.some(e => e === entry)) {
			this.setValue(key, [...arr, entry]);
		}
	}

	/**
	 * Remove the given entry from the array with the given key (if the key exists)
	 */
	public removeValue<T>(key: string, entry: T): void {
		const arr: T[] = this.getValueOr(key, null);
		if (arr) {
			this.setValue(key, arr.filter(e => e !== entry));
		}
	}

}