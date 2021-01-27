import ElectronStore from 'electron-store';

const Store = require('electron-store');

export class ConfigDataAccess {

    store: ElectronStore;


    constructor() {
        this.store = new Store();
        console.log('Creating config store at ' + this.store.path);
    }


    public getLastOpenedLibraries(): any {
        return this.store.get('lastOpened');
    }


    public setLastOpenedLibraries(lastOpened: any) {
        this.store.set('lastOpened', lastOpened);
    }

}