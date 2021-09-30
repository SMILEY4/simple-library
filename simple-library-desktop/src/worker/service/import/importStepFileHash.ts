import { Hash } from 'crypto';
import {FileSystemWrapper} from "../fileSystemWrapper";
import {ItemData} from "./importService";

const crypto = require('crypto');

export class ImportStepFileHash {

    private readonly fsWrapper: FileSystemWrapper;

    constructor(fsWrapper: FileSystemWrapper) {
        this.fsWrapper = fsWrapper;
    }


    /**
     * Calculates the hash of the given file/item and appends it to the given item data
     * @param itemData the data of the file/item
     * @return a promise that resolves with the given item data, but with the calculated hash
     */
    public handle(itemData: ItemData): Promise<ItemData> {
        return this.computeHash(itemData.filepath)
            .then(hash => {
                itemData.hash = hash;
                return itemData;
            });
    }


    private computeHash(filepath: string): Promise<string> {
        return Promise.resolve()
            .then(() => console.log('start computing hash for file "' + filepath + '"'))
            .then(() => crypto.createHash("md5"))
            .then((hashFunction: Hash) => this.computeHashWithAlgorithm(filepath, hashFunction))
            .then((hash: string) => {
                if (!hash || hash.length === 0) {
                    throw "Could not calculate hash";
                } else {
                    return hash;
                }
            });
    }


    private computeHashWithAlgorithm(filepath: string, hashFunction: Hash): Promise<string> {
        return new Promise((resolve, reject) => {
            const rs = this.fsWrapper.createReadStream(filepath);
            rs.on('error', (err: Error) => {
                console.log("error while computing hash for file " + filepath + ": " + err);
                reject(err);
            });
            rs.on('data', (chunk: Buffer | string) => {
                hashFunction = hashFunction.update(chunk);
            });
            rs.on('end', () => {
                resolve(hashFunction.digest('hex'));
            });
        });
    }

}
