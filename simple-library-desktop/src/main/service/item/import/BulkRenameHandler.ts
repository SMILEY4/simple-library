import {
    BulkRenameData,
    FileAction,
    ImportFileHandleData,
    ItemData,
    RenamePart,
    RenamePartType,
} from '../../../models/commonModels';
import path from 'path';
import { startAsyncWithValue } from '../../../../common/AsyncCommon';

export class BulkRenameHandler {

    public handleImportData(itemData: ItemData, handleData: ImportFileHandleData, renameData: BulkRenameData, index: number): Promise<ItemData> {
        return startAsyncWithValue(itemData)
            .then(data => {
                data.filepath = this.getNewFilepath(
                    data.orgFilepath,
                    handleData.action === FileAction.KEEP ? undefined : handleData.targetDir,
                    index,
                    renameData
                );
                return data;
            });
    }

    public getNewFilepath(filepath: string, targetDir: undefined | string, index: number, renameData: BulkRenameData): string {
        const dirname = targetDir ? targetDir : path.dirname(filepath);
        const filename = path.basename(filepath);
        return path.join(dirname, this.getNewFilename(filename, index, renameData));
    }

    public getNewFilename(filename: string, index: number, renameData: BulkRenameData): string {
        if (renameData.doRename) {
            const extension = path.extname(filename);
            const pureFilename = path.basename(filename, extension);
            const nextFilename = renameData.parts
                .map(part => BulkRenameHandler.getFilenamePart(part, pureFilename, index))
                .join("");
            return nextFilename + extension;
        } else {
            return filename;
        }
    }

    private static getFilenamePart(renamePart: RenamePart, orgFilename: string, index: number): string {
        switch (renamePart.type) {
            case RenamePartType.NOTHING:
                return "";
            case RenamePartType.TEXT:
                return renamePart.value;
            case RenamePartType.NUMBER_FROM:
                const partNumber = parseInt(renamePart.value);
                const strValue = ((isNaN(partNumber) ? 0 : partNumber) + index).toString();
                return strValue.padStart(renamePart.value.length, "0");
            case RenamePartType.ORIGINAL_FILENAME:
                return orgFilename;
        }
    }

}
