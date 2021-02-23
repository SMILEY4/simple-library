import { doAsync, startAsync } from '../../../../common/AsyncCommon';
import { Hash } from 'crypto';
import { ItemData } from '../../../../common/commonModels';
import { FileSystemWrapper } from '../../utils/fileSystemWrapper';

const crypto = require('crypto');

export class ImportStepFileHash {

    fsWrapper: FileSystemWrapper;

    constructor(fsWrapper: FileSystemWrapper) {
        this.fsWrapper = fsWrapper;
    }

    public handle(itemData: ItemData): Promise<ItemData> {
        return this.computeHash(itemData.filepath)
            .then(hash => {
                itemData.hash = hash;
                return itemData;
            });
    }

    private computeHash(filepath: string): Promise<string> {
        return startAsync()
            .then(() => console.log('start computing hash for file "' + filepath + '"'))
            .then(() => crypto.createHash("md5"))
            .then((hash: Hash) => this.computeHashWithAlgorithm(filepath, hash))
            .then((hash: string) => {
                if (!hash || hash.length === 0) {
                    throw "Could not calculate hash";
                } else {
                    return hash;
                }
            });
    }

    private computeHashWithAlgorithm(filepath: string, hash: Hash): Promise<string> {
        return doAsync((resolve, reject) => {
            const rs = this.fsWrapper.createReadStream(filepath);
            rs.on('error', (err: Error) => {
                console.log("error while computing hash for file " + filepath + ": " + err);
                reject(err);
            });
            rs.on('data', (chunk: Buffer | string) => {
                hash = hash.update(chunk);
            });
            rs.on('end', () => {
                resolve(hash.digest('hex'));
            });
        });
    }

}
