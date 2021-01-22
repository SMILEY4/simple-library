import DataAccess from '../persistence/dataAccess';
import path from 'path';
import { Result } from '../utils/result';

export class AppService {

    dataAccess: DataAccess;

    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    public createLibrary(targetDir: string, name: string): Result {
        const filename: string = this.toFilename(name);
        const fullPath = path.join(targetDir, filename);
        return this.dataAccess.createLibrary(fullPath, name);
    }


    private toFilename(name: string): string {
        return name
                .replace(/\s/g, '') // remove whitespaces
                .replace(/[^a-zA-Z0-9]/g, '') // remove everything except characters or numbers
            + '.db';
    }


    public disposeLibrary(): void {
    }


}