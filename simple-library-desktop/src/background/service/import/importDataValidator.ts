import {
    BulkRenameInstruction,
    ImportFileTarget,
    ImportProcessData,
    ImportTargetAction,
    renamePartIsConst,
    RenamePartType
} from "../../../common/commonModels";
import {FileSystemWrapper} from "../fileSystemWrapper";


export class ImportDataValidator {

    fsWrapper: FileSystemWrapper;


    constructor(fsWrapper: FileSystemWrapper) {
        this.fsWrapper = fsWrapper;
    }

    /**
     * Validate the given import process data. Throw error when the
     * @param data the data to validate
     * @throws string with the error message of the failed validation-step
     */
    public validate(data: ImportProcessData): void {
        this.validateImportTarget(data.importTarget);
        this.validateRenameInstructions(data.renameInstructions, data.files.length);
    }


    private validateImportTarget(data: ImportFileTarget): void {
        switch (data.action) {
            case ImportTargetAction.KEEP: {
                break;
            }
            case ImportTargetAction.MOVE: {
                this.validateImportTargetMove(data);
                break;
            }
            case ImportTargetAction.COPY: {
                this.validateImportTargetCopy(data);
                break;
            }

        }
    }


    private validateImportTargetMove(data: ImportFileTarget) {
        if (!data.targetDir || data.targetDir.length === 0 || !this.fsWrapper.existsDir(data.targetDir)) {
            throw "Target directory does not exist.";
        }
    }


    private validateImportTargetCopy(data: ImportFileTarget) {
        if (!data.targetDir || data.targetDir.length === 0 || !this.fsWrapper.existsDir(data.targetDir)) {
            throw "Target directory does not exist.";
        }
    }

    private validateRenameInstructions(data: BulkRenameInstruction, amountFiles: number): void {
        if (data.doRename) {
            if (data.parts.length == 0) {
                throw "No rename parts given.";
            }
            if (data.parts.every(p => p.type === RenamePartType.NOTHING)) {
                throw "At least one rename part must be not 'nothing'.";
            }
            if (amountFiles > 1 && !data.parts.some(p => renamePartIsConst(p.type))) {
                throw "Renaming multiple files resulting in same filename for all.";
            }
            data.parts.forEach(part => {
                switch (part.type) {
                    case RenamePartType.NOTHING:
                        break;
                    case RenamePartType.TEXT:
                        ImportDataValidator.validateRenamePartText(part.value);
                        break;
                    case RenamePartType.NUMBER_FROM:
                        ImportDataValidator.validateRenamePartNumberFrom(part.value);
                        break;
                    case RenamePartType.ORIGINAL_FILENAME:
                        break;
                }
            });
        }
    }


    private static validateRenamePartText(value: string) {
        if (!value || value.length === 0) {
            throw "Value of rename part 'text' must not be empty.";
        }
    }


    private static validateRenamePartNumberFrom(value: string) {
        if (!value || value.length === 0) {
            throw "Value of rename part 'number from' must not be empty.";
        }
        const parsed: number = parseInt(value, 10);
        if (isNaN(parsed)) {
            throw "Value of rename part 'number from' must be a valid number.";
        }
        if (parsed < 0) {
            throw "Value of rename part 'number from' must be greater or equal to 0.";
        }
    }

}
