import DataAccess from '../persistence/dataAccess';
import path from 'path';
import { errorResult, Result } from '../utils/result';

const fs = require('fs');

export class AppService {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    public createLibrary(targetDir: string, name: string): Result {
        const filename: string = AppService.toFilename(name);
        const fullPath = path.join(targetDir, filename);
        if (fs.existsSync(fullPath)) {
            return errorResult(['File with the same name already exists (' + fullPath + ').']);
        } else {
            return this.dataAccess.createLibrary(fullPath, name);
        }
    }


    public disposeLibrary(): void {
        this.dataAccess.closeDatabase();
    }


    public async getLibraryMetadata() {
        return await this.dataAccess.getMetadata();
    }


    private static toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }
}