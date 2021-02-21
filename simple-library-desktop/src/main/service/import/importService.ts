import { startAsync } from '../../../common/AsyncCommon';
import { FileHasher } from './FileHasher';
import { ThumbnailGenerator } from './ThumbnailGenerator';
import { ItemDataAccess } from '../../persistence/itemDataAccess';

const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');

export interface ImportData {
    timestamp: number,
    filepath: string,
    hash: string,
    thumbnail: string,
}

export class ImportService {

    itemDataAccess: ItemDataAccess;
    fileHasher: FileHasher;
    thumbnailGenerator: ThumbnailGenerator;


    constructor(itemDataAccess: ItemDataAccess) {
        this.itemDataAccess = itemDataAccess;
        this.fileHasher = new FileHasher();
        this.thumbnailGenerator = new ThumbnailGenerator();
    }

    public async importFiles(files: string[]): Promise<void> {
        console.log("starting import of " + files.length + " files.");
        for (let i = 0; i < files.length; i++) {
            await startAsync()
                .then(() => console.log("importing file: " + files[i]))
                .then(() => ImportService.baseImportData(files[i]))
                .then((data: ImportData) => this.fileHasher.appendHash(data))
                .then((data: ImportData) => this.thumbnailGenerator.appendBase64Thumbnail(data))
                .then((data: ImportData) => this.itemDataAccess.insertItem(data))
                .then(() => console.log("done importing file: " + files[i]))
                .catch((error) => console.error("Error while importing file " + files[i] + ": " + error));
        }
        console.log("import of " + files.length + " complete.");
    }

    private static baseImportData(filepath: string) {
        return {
            timestamp: Date.now(),
            filepath: filepath,
        };
    }

}