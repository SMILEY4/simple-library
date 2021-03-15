import { ReadStream, Stats } from 'fs';

const fs = require('fs');
const fsp = fs.promises;

export class FileSystemWrapper {

    /**
     * Moves the given file to the given destination
     * @param source the path of the file to move
     * @param target the path of the destination file
     * @return a promise that resolves with the target filepath
     */
    public move(source: string, target: string): Promise<string> {
        return fsp.rename(source, target)
            .then(() => target);
    }

    /**
     * Copies the given file to the given destination
     * @param source the path of the file to copy
     * @param target the path of the destination file
     * @param allowOverwrite whether to allow an existing file at the target to be overwritten. Fails if 'false' and target already exists.
     * @return a promise that resolves with the target filepath
     */
    public copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        const mode: number = allowOverwrite ? 0 : fs.constants.COPYFILE_EXCL;
        return fsp.copyFile(source, target, mode)
            .then(() => target);
    }

    /**
     * Opens a {@link ReadStream} from the given file
     * @param filepath the path of the file to
     * @return the created stream
     */
    public createReadStream(filepath: string): ReadStream {
        return fs.createReadStream(filepath);
    }

    /**
     * Checks whether the given file exists (sync)
     * @param path the path to the file
     * @return true if the file at the given path exists and is a file
     */
    public existsFile(path: string): boolean {
        try {
            const stats: Stats = fs.statSync(path);
            return stats.isFile();
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks whether the given directory exists (sync)
     * @param path the path to the directory
     * @return true if the directory at the given path exists and is a directory
     */
    public existsDir(path: string): boolean {
        try {
            const stats: Stats = fs.statSync(path);
            return stats.isDirectory();
        } catch (e) {
            return false;
        }
    }

}