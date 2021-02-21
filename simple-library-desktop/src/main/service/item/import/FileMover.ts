import { FileAction, ItemData } from '../../../models/commonModels';
import { startAsync, startAsyncWithValue } from '../../../../common/AsyncCommon';
import path from 'path';

const fs = require('fs').promises;

export class FileMover {

    public handleFile(importData: ItemData, action: FileAction, targetDir: string | undefined): Promise<ItemData> {
        return startAsync()
            .then(() => {
                switch (action) {
                    case FileAction.KEEP:
                        return this.keepFile(importData.filepath);
                    case FileAction.MOVE:
                        return this.moveFile(importData.filepath, targetDir);
                    case FileAction.COPY:
                        return this.copyFile(importData.filepath, targetDir);
                }
            })
            .then(path => {
                importData.filepath = path;
                return importData;
            });
    }

    private keepFile(filepath: string): Promise<string> {
        return startAsyncWithValue(filepath);
    }

    private moveFile(filepath: string, targetDir: string): Promise<string> {
        return startAsync()
            .then(() => FileMover.getNewPath(filepath, targetDir))
            .then(target => {
                console.log("moving file: " + filepath + " => " + target);
                fs.rename(filepath, target);
                return target;
            });
    }

    private copyFile(filepath: string, targetDir: string): Promise<string> {
        return startAsync()
            .then(() => {
                return FileMover.getNewPath(filepath, targetDir);
            })
            .then(target => {
                console.log("copy file: " + filepath + " => " + target);
                fs.copyFile(filepath, target);
                return target;
            });
    }

    private static getNewPath(filepath: string, targetDir: string): string {
        const filename = path.basename(filepath);
        return path.join(targetDir, filename);
    }

}
