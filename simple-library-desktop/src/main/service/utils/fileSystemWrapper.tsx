const fs = require('fs').promises;

export class FileSystemWrapper {

    public async move(source: string, target: string): Promise<string> {
        return fs.rename(source, target)
            .then(() => target);
    }

    public copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        const mode: number = allowOverwrite ? 0 : fs.constants.COPYFILE_EXCL;
        return fs.copyFile(source, target, mode)
            .then(() => target);
    }

}