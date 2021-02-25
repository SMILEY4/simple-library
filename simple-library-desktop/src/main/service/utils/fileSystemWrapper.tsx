import { ReadStream, Stats } from 'fs';

const fs = require('fs');
const fsp = fs.promises;

export class FileSystemWrapper {

    public async move(source: string, target: string): Promise<string> {
        return fsp.rename(source, target)
            .then(() => target);
    }

    public async copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        const mode: number = allowOverwrite ? 0 : fs.constants.COPYFILE_EXCL;
        return fsp.copyFile(source, target, mode)
            .then(() => target);
    }

    public createReadStream(filepath: string): ReadStream {
        return fs.createReadStream(filepath);
    }

    public existsFile(path: string): boolean {
        try {
            const stats: Stats = fs.statSync(path);
            return stats.isFile();
        } catch (e) {
            return false;
        }
    }

    public existsDir(path: string): boolean {
        try {
            const stats: Stats = fs.statSync(path);
            return stats.isDirectory();
        } catch (e) {
            return false;
        }
    }

}