import path from "path";
import {BulkRenameInstruction, ImportFileTarget, ImportTargetAction, ItemData, RenamePart} from "./importService";

export class ImportStepRename {

    /**
     * Calculates the target filepath with the new filename
     * @param itemData data of the item/file
     * @param handleData data about how to handle the file, i.e. keep, move or copy
     * @param renameInstruction the instructions about how to rename the file(s)
     * @param counter the counter, starting with the first imported file (of the current process) and counting up
     * @return the given item data, but with the new filepath
     */
    public handle(itemData: ItemData, handleData: ImportFileTarget, renameInstruction: BulkRenameInstruction, counter: number): ItemData {
        const targetDir: string = this.getTargetDir(handleData.action, handleData.targetDir);
        itemData.filepath = this.getNewFilepath(itemData.sourceFilepath, targetDir, renameInstruction, counter);
        return itemData;
    }

    private getTargetDir(action: ImportTargetAction, targetDir: string | null) {
        return (action === "keep") ? null : targetDir;
    }


    private getNewFilepath(
        filepath: string,
        targetDir: string | null,
        renameInstruction: BulkRenameInstruction,
        counter: number
    ): string {
        const dirname = targetDir ? targetDir : path.dirname(filepath);
        const filename = this.getNewFilename(path.basename(filepath), renameInstruction, counter);
        return path.join(dirname, filename);
    }


    private getNewFilename(filename: string, renameInstruction: BulkRenameInstruction, counter: number): string {
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
            case "nothing":
                return this.getFilenamePartNothing();
            case "text":
                return this.getFilenamePartText(renamePart);
            case "number_from":
                return this.getFilenamePartNumberFrom(renamePart, counter);
            case "original_filename":
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
