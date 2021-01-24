import DataAccess from '../persistence/dataAccess';
import path from 'path';
import { LibraryDataAccess, LibraryMetadata } from '../persistence/libraryDataAccess';

const fs = require('fs');

export class AppService {

    dataAccess: DataAccess;
    libraryDataAccess: LibraryDataAccess;

    constructor(dataAccess: DataAccess, libraryDataAccess: LibraryDataAccess) {
        this.dataAccess = dataAccess;
        this.libraryDataAccess = libraryDataAccess;
    }

    public createLibrary(targetDir: string, name: string): Promise<void> {
        const filename: string = AppService.toFilename(name);
        const fullPath = path.join(targetDir, filename);
        if (fs.existsSync(fullPath)) {
            console.log("Could not create library. File already exists: " + fullPath)
            return Promise.reject('File with the same name already exists (' + fullPath + ').');
        } else {
            console.log("Creating new library: " + fullPath)
            return this.libraryDataAccess.createLibrary(fullPath, name);
        }
    }

    public disposeLibrary(): void {
        this.dataAccess.closeDatabase();
    }

    public getLibraryMetadata(): Promise<LibraryMetadata> {
        return this.libraryDataAccess.getLibraryMetadata();
    }

    private static toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }
}