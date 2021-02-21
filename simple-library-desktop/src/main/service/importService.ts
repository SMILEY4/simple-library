import DataAccess from '../persistence/dataAccess';
import { sqlInsertItem } from '../persistence/sql';

const fs = require('fs');
const crypto = require('crypto');


export class ImportService {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public async importFiles(files: string[]): Promise<void> {
        console.log("starting import of " + files.length + " files.");
        const timestamp = Date.now();
        for (let i = 0; i < files.length; i++) {
            const file: string = files[i];
            console.log("importing file: " + file);

            const hash: string = await this.computeHash(file);
            console.log("hash: " + hash);

            console.log("inserting file into db")
            await this.dataAccess.executeRun(sqlInsertItem(file, timestamp, hash));

            console.log("done importing " + file)
        }
        console.log("import complete");

    }


    computeHash(filepath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log('start computing hash: ' + filepath);
            let hash = crypto.createHash('md5');
            let rs = fs.createReadStream(filepath);
            rs.on('error', (err: Error) => {
                console.log("error while computing hash: " + err);
                reject(err);
            });
            rs.on('data', (chunk: Buffer | string) => hash = hash.update(chunk));
            rs.on('end', () => resolve(hash.digest('hex')));
        });
    }

}