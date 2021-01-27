import ElectronStore from 'electron-store';
import { LastOpenedLibraryEntry } from '../models/commonModels';

const Store = require('electron-store');

export class ConfigDataAccess {

    store: ElectronStore;


    constructor() {
        this.store = new Store();
        console.log('Creating config store at ' + this.store.path);
    }


    public getLastOpenedLibraries(): LastOpenedLibraryEntry[] {
        const data: any = this.store.get('lastOpened');
        return (data ? data : [])
            .map((entry: any) => ({ name: entry.name, path: entry.path }));
    }


    public setLastOpenedLibraries(lastOpened: any) {
        this.store.set('lastOpened', lastOpened);
    }

}