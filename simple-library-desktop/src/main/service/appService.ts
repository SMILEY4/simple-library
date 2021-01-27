import DataAccess from '../persistence/dataAccess';
import path from 'path';
import { LibraryDataAccess } from '../persistence/libraryDataAccess';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../models/commonModels';
import ElectronStore from 'electron-store';

const fs = require('fs');
const Store = require('electron-store');


export class AppService {

    dataAccess: DataAccess;
    libraryDataAccess: LibraryDataAccess;
    store: ElectronStore;

    constructor(dataAccess: DataAccess, libraryDataAccess: LibraryDataAccess) {
        this.dataAccess = dataAccess;
        this.libraryDataAccess = libraryDataAccess;
        this.store = new Store();
        console.log('Creating config store at ' + this.store.path);
    }

    public createLibrary(targetDir: string, name: string): Promise<void> {
        const filename: string = AppService.toFilename(name);
        const fullPath = path.join(targetDir, filename);
        if (fs.existsSync(fullPath)) {
            console.log('Could not create library. File already exists: ' + fullPath);
            return Promise.reject('File with the same name already exists (' + fullPath + ').');
        } else {
            console.log('Creating new library: ' + fullPath);
            return this.libraryDataAccess.createLibrary(fullPath, name)
                .then(() => this.pushLibraryLastOpened(name, fullPath));
        }
    }

    public openLibrary(path: string): Promise<void> {
        return this.libraryDataAccess.openLibrary(path)
            .then((name: string) => {
                this.pushLibraryLastOpened(name, path);
            });
    }

    public disposeLibrary(): void {
        this.dataAccess.closeDatabase();
    }

    public getLibraryMetadata(): Promise<LibraryMetadata> {
        return this.libraryDataAccess.getLibraryMetadata();
    }

    public pushLibraryLastOpened(name: string, path: string) {
        try {
            let lastOpened: any = this.store.get('lastOpened');
            if (lastOpened) {
                lastOpened = lastOpened.filter((e: any) => e.path != path);
                lastOpened = [{ name: name, path: path }, ...lastOpened];
                lastOpened = lastOpened.slice(0, Math.min(lastOpened.length, 3));
            } else {
                lastOpened = [{ name: name, path: path }];
            }
            this.store.set('lastOpened', lastOpened);
        } catch (err) {
        }
    }

    public getLibrariesLastOpened(): Promise<LastOpenedLibraryEntry[]> {
        return new Promise((resolve, reject) => {
            const data: any = this.store.get('lastOpened');
            resolve(data ? data.map((entry: any) => ({ name: entry.name, path: entry.path })) : []);
        });
    }

    private static toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }
}