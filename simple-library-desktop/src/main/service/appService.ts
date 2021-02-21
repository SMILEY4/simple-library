import path from 'path';
import { LibraryDataAccess } from '../persistence/libraryDataAccess';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../models/commonModels';
import { ConfigDataAccess } from '../persistence/configDataAccess';

const fs = require('fs');

export class AppService {

    libraryDataAccess: LibraryDataAccess;
    configDataAccess: ConfigDataAccess;


    constructor(libraryDataAccess: LibraryDataAccess, configDataAccess: ConfigDataAccess) {
        this.libraryDataAccess = libraryDataAccess;
        this.configDataAccess = configDataAccess;
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
                .then(() => this.addLibraryLastOpened(name, fullPath));
        }
    }


    public openLibrary(path: string): Promise<void> {
        return this.libraryDataAccess.openLibrary(path)
            .then((name: string) => {
                this.addLibraryLastOpened(name, path);
            });
    }


    public closeCurrentLibrary(): void {
        this.libraryDataAccess.closeCurrentLibrary();
    }


    public getLibraryMetadata(): Promise<LibraryMetadata> {
        return this.libraryDataAccess.getLibraryMetadata();
    }


    public addLibraryLastOpened(name: string, path: string) {
        try {
            let lastOpened: LastOpenedLibraryEntry[] = this.configDataAccess.getLastOpenedLibraries();
            if (lastOpened) {
                lastOpened = lastOpened.filter((e: any) => e.path != path);
                lastOpened = [{ name: name, path: path }, ...lastOpened];
                lastOpened = lastOpened.slice(0, Math.min(lastOpened.length, 3));
            } else {
                lastOpened = [{ name: name, path: path }];
            }
            this.configDataAccess.setLastOpenedLibraries(lastOpened);
        } catch (err) {
        }
    }


    public getLibrariesLastOpened(): Promise<LastOpenedLibraryEntry[]> {
        return new Promise((resolve, reject) => {
            resolve(this.configDataAccess.getLastOpenedLibraries());
        });
    }


    private static toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }

}