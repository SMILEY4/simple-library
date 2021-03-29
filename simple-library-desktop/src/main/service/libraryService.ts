import path from 'path';
import { LibraryDataAccess } from '../persistence/libraryDataAccess';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../../common/commonModels';
import { ConfigDataAccess } from '../persistence/configDataAccess';

const fs = require('fs');

export class LibraryService {

    libraryDataAccess: LibraryDataAccess;
    configDataAccess: ConfigDataAccess;


    constructor(libraryDataAccess: LibraryDataAccess, configDataAccess: ConfigDataAccess) {
        this.libraryDataAccess = libraryDataAccess;
        this.configDataAccess = configDataAccess;
    }


    /**
     * Creates a new library with the given name in the given directory
     * @param targetDir the directory to create the library in
     * @param name the name of the library. The filename is derived from this name.
     * @return a promise that resolves when the library was created
     */
    public createLibrary(targetDir: string, name: string): Promise<void> {
        const filename: string = LibraryService.toFilename(name);
        const fullPath = path.join(targetDir, filename);
        if (fs.existsSync(fullPath)) {
            console.log('Could not create library. File already exists: ' + fullPath);
            return Promise.reject('File with the same name already exists (' + fullPath + ').');
        } else {
            console.log('Creating new library: ' + fullPath);
            return this.libraryDataAccess.createLibrary(fullPath, name)
                .then(() => this.addLibraryToLastOpened(name, fullPath));
        }
    }


    /**
     * Opens the library at the given path
     * @param path the path to the library-file
     * @return a promise that resolves when the file was opened
     */
    public openLibrary(path: string): Promise<void> {
        return this.libraryDataAccess.openLibrary(path)
            .then((name: string) => {
                this.addLibraryToLastOpened(name, path);
            });
    }


    /**
     * Closes the currently open library
     */
    public closeCurrentLibrary(): void {
        this.libraryDataAccess.closeCurrentLibrary();
    }


    /**
     * Get the metadata of the currently open library
     * @return a promise that resolves with the {@link LibraryMetadata}
     */
    public getLibraryMetadata(): Promise<LibraryMetadata> {
        return this.libraryDataAccess.getLibraryMetadata();
    }


    /**
     * Get the last opened libraries
     * @return a promise that resolves with the {@link LastOpenedLibraryEntry}s
     */
    public getLibrariesLastOpened(): Promise<LastOpenedLibraryEntry[]> {
        return new Promise((resolve, reject) => {
            resolve(this.configDataAccess.getLastOpenedLibraries());
        });
    }


    private addLibraryToLastOpened(name: string, path: string) {
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


    private static toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }

}