import { ReadStream } from 'fs';

const fs = require('fs');
const fsp = fs.promises;

export class FileSystemWrapper {

    public async move(source: string, target: string): Promise<string> {
        return fsp.rename(source, target)
            .then(() => target);
    }

    public copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        const mode: number = allowOverwrite ? 0 : fs.constants.COPYFILE_EXCL;
        return fsp.copyFile(source, target, mode)
            .then(() => target);
    }

    public createReadStream(filepath: string): ReadStream {
        return fs.createReadStream(filepath);
    }

}