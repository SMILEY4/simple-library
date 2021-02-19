import { LibraryDataAccess } from '../persistence/libraryDataAccess';
import { ConfigDataAccess } from '../persistence/configDataAccess';

const fs = require('fs');


export class ImportService {

    libraryDataAccess: LibraryDataAccess;
    configDataAccess: ConfigDataAccess;


    constructor(libraryDataAccess: LibraryDataAccess, configDataAccess: ConfigDataAccess) {
        this.libraryDataAccess = libraryDataAccess;
        this.configDataAccess = configDataAccess;
    }

    public importFiles(files: string[]): Promise<void> {
        console.log("SERVICE: IMPORT FILES")
        return new Promise((resolve, reject) => resolve());// todo
    }

}