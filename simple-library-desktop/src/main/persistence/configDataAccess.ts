import ElectronStore from 'electron-store';
import {LastOpenedLibraryEntry} from '../../common/commonModels';

const Store = require('electron-store');

export class ConfigDataAccess {

	store: ElectronStore;


	constructor() {
		this.store = new Store();
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
		const data: any = this.store.get('lastOpened');
		return (data ? data : [])
			.map((entry: any) => ({name: entry.name, path: entry.path}));
	}


	/**
	 * Overrides the current "last-opened" libraries with the given ones
	 * @param lastOpened the array of new "last-opened" libraries
	 */
	public setLastOpenedLibraries(lastOpened: LastOpenedLibraryEntry[]) {
		this.store.set('lastOpened', lastOpened);
	}

}