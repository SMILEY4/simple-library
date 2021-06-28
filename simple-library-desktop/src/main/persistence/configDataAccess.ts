import ElectronStore from 'electron-store';
import {LastOpenedLibraryEntry} from '../../common/commonModels';

const Store = require('electron-store');

export class ConfigDataAccess {

	KEY_LAST_OPENED: string = "lastOpened";
	KEY_THEME: string = "theme";
	KEY_EXIFTOOL_LOCATION: string = "exiftool";

	store: ElectronStore;


	constructor() {
		this.store = new Store();
		if (!this.store.has(this.KEY_LAST_OPENED)) {
			this.store.set(this.KEY_LAST_OPENED, [])
		}
		if (!this.store.has(this.KEY_THEME)) {
			this.store.set(this.KEY_THEME, "dark")
		}
		if (!this.store.has(this.KEY_EXIFTOOL_LOCATION)) {
			this.store.set(this.KEY_EXIFTOOL_LOCATION, "")
		}
		console.log('Creating config store at ' + this.store.path);
	}

	/**
	 * @return the path to the application config file
	 */
	public getConfigFileLocation(): string {
		return this.store.path;
	}


	/**
	 * @return the array of last opened libraries
	 */
	public getLastOpenedLibraries(): LastOpenedLibraryEntry[] {
		const data: any = this.store.get(this.KEY_LAST_OPENED);
		return (data ? data : [])
			.map((entry: any) => ({name: entry.name, path: entry.path}));
	}


	/**
	 * Overrides the current "last-opened" libraries with the given ones
	 * @param lastOpened the array of new "last-opened" libraries
	 */
	public setLastOpenedLibraries(lastOpened: LastOpenedLibraryEntry[]) {
		this.store.set(this.KEY_LAST_OPENED, lastOpened);
	}


	/**
	 * @return the application theme
	 */
	public getApplicationTheme(): "light" | "dark" {
		const data: any = this.store.get(this.KEY_THEME);
		return (data ? data : "light");
	}


	/**
	 * Saves the application theme
	 * @param theme the new application theme to save
	 */
	public setApplicationTheme(theme: "light" | "dark"): void {
		this.store.set(this.KEY_THEME, theme);
	}


	/**
	 * @return the full path to the exiftool executable or null
	 */
	public getExiftoolLocation(): string | null {
		const data: any = this.store.get(this.KEY_EXIFTOOL_LOCATION);
		return (data && ("" + data).length > 0) ? "" + data : null;
	}

}