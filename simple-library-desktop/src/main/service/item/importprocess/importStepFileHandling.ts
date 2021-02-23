import { FileTargetAction, ItemData } from '../../../../common/commonModels';
import { startAsync, startAsyncWithValue } from '../../../../common/AsyncCommon';
import { FileSystemWrapper } from '../../utils/fileSystemWrapper';

export class ImportStepFileHandling {

    fsWrapper: FileSystemWrapper;

    constructor(fsWrapper: FileSystemWrapper) {
        this.fsWrapper = fsWrapper;
    }

    public handle(itemData: ItemData, action: FileTargetAction): Promise<ItemData> {
        return startAsync()
            .then(() => {
                switch (action) {
                    case FileTargetAction.KEEP:
                        return this.keepFile(itemData.sourceFilepath, itemData.filepath);
                    case FileTargetAction.MOVE:
                        return this.moveFile(itemData.sourceFilepath, itemData.filepath);
                    case FileTargetAction.COPY:
                        return this.copyFile(itemData.sourceFilepath, itemData.filepath);
                }
            })
            .then(() => itemData);
    }

    private keepFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
        if (sourceFilepath === targetFilepath) {
            return startAsyncWithValue(targetFilepath);
        } else {
            return this.moveFile(sourceFilepath, targetFilepath);
        }
    }

    private moveFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
        return this.fsWrapper.move(sourceFilepath, targetFilepath);
    }

    private copyFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
        return this.fsWrapper.copy(sourceFilepath, targetFilepath, false);
    }

}
