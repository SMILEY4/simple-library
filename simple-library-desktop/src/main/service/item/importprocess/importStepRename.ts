import {
    BulkRenameInstruction,
    ImportTargetAction,
    ImportFileTarget,
    ItemData,
    RenamePart,
    RenamePartType,
} from '../../../../common/commonModels';
import path from 'path';
import { startAsyncWithValue } from '../../../../common/AsyncCommon';

export class ImportStepRename {

    public handle(itemData: ItemData,
                  handleData: ImportFileTarget,
                  renameInstruction: BulkRenameInstruction,
                  counter: number): Promise<ItemData> {
        return startAsyncWithValue(itemData)
            .then(data => {
                const targetDir: string = (handleData.action === ImportTargetAction.KEEP) ? undefined : handleData.targetDir;
                data.filepath = this.getNewFilepath(data.sourceFilepath, targetDir, renameInstruction, counter);
                return data;
            });
    }

    public getNewFilepath(filepath: string,
                          targetDir: undefined | string,
                          renameInstruction: BulkRenameInstruction,
                          counter: number): string {
        const dirname = targetDir ? targetDir : path.dirname(filepath);
        const filename = path.basename(filepath);
        return path.join(dirname, this.getNewFilename(filename, renameInstruction, counter));
    }

    public getNewFilename(filename: string,
                          renameInstruction: BulkRenameInstruction,
                          counter: number): string {
        if (renameInstruction.doRename) {
            const extension = path.extname(filename);
            const pureFilename = path.basename(filename, extension);
            const nextFilename = renameInstruction.parts
                .map(part => ImportStepRename.getFilenamePart(part, pureFilename, counter))
                .join("");
            return nextFilename + extension;
        } else {
            return filename;
        }
    }

    private static getFilenamePart(renamePart: RenamePart, filename: string, counter: number): string {
        switch (renamePart.type) {
            case RenamePartType.NOTHING:
                return this.getFilenamePartNothing();
            case RenamePartType.TEXT:
                return this.getFilenamePartText(renamePart);
            case RenamePartType.NUMBER_FROM:
                return this.getFilenamePartNumberFrom(renamePart, counter);
            case RenamePartType.ORIGINAL_FILENAME:
                return this.getFilenamePartOriginalFilename(filename);
        }
    }

    private static getFilenamePartNothing() {
        return "";
    }

    private static getFilenamePartText(part: RenamePart) {
        return part.value;
    }

    private static getFilenamePartNumberFrom(part: RenamePart, counter: number) {
        const partNumber = parseInt(part.value);
        const strValue = ((isNaN(partNumber) ? 0 : partNumber) + counter).toString();
        return strValue.padStart(part.value.length, "0");
    }

    private static getFilenamePartOriginalFilename(filename: string) {
        return filename;
    }

}
