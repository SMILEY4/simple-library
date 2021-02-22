import { FileAction, ItemData } from '../../../models/commonModels';
import { startAsync, startAsyncWithValue } from '../../../../common/AsyncCommon';

const fs = require('fs').promises;

export class ImportFileHandler {

    public handleFile(itemData: ItemData, action: FileAction): Promise<ItemData> {
        return startAsync()
            .then(() => {
                switch (action) {
                    case FileAction.KEEP:
                        return this.handleKeepFile(itemData.orgFilepath, itemData.filepath);
                    case FileAction.MOVE:
                        return this.handleMoveFile(itemData.orgFilepath, itemData.filepath);
                    case FileAction.COPY:
                        return this.handleCopyFile(itemData.orgFilepath, itemData.filepath);
                }
            })
            .then(() => itemData);
    }

    private handleKeepFile(orgFilepath: string, filepath: string): Promise<string> {
        if (orgFilepath === filepath) {
            return startAsyncWithValue(filepath);
        } else {
            return this.handleMoveFile(orgFilepath, filepath);
        }
    }

    private handleMoveFile(orgFilepath: string, filepath: string): Promise<string> {
        return startAsync()
            .then(() => {
                console.log("moving file: " + orgFilepath + " => " + filepath);
                fs.rename(orgFilepath, filepath);
                return filepath;
            });
    }

    private handleCopyFile(orgFilepath: string, filepath: string): Promise<string> {
        return startAsync()
            .then(() => {
                console.log("copy file: " + orgFilepath + " => " + filepath);
                fs.copyFile(orgFilepath, filepath);
                return filepath;
            });
    }

}
