import {
    BulkRenameInstruction,
    ImportFileTarget,
    ImportProcessData,
    ImportTargetAction,
    RenamePartType,
} from '../../../../common/commonModels';
import { FileSystemWrapper } from '../../utils/fileSystemWrapper';


export class ImportDataValidator {

    fsWrapper: FileSystemWrapper;

    constructor(fsWrapper: FileSystemWrapper) {
        this.fsWrapper = fsWrapper;
    }

    public validate(data: ImportProcessData): void {
        this.validateImportTarget(data.importTarget);
        this.validateRenameInstructions(data.renameInstructions);
    }


    private validateImportTarget(data: ImportFileTarget): void {
        switch (data.action) {
            case ImportTargetAction.KEEP:
                break;
            case ImportTargetAction.MOVE: {
                if (!data.targetDir || data.targetDir.length === 0 || !this.fsWrapper.existsDir(data.targetDir)) {
                    throw "Target directory does not exist.";
                }
                break;
            }
            case ImportTargetAction.COPY: {
                if (!data.targetDir || data.targetDir.length === 0 || !this.fsWrapper.existsDir(data.targetDir)) {
                    throw "Target directory does not exist.";
                }
                break;
            }

        }
    }


    private validateRenameInstructions(data: BulkRenameInstruction): void {
        if (data.doRename) {
            if (data.parts.length == 0) {
                throw "No rename parts given.";
            }
            if (data.parts.every(p => p.type === RenamePartType.NOTHING)) {
                throw "At least one rename part must be not 'nothing'.";
            }
            data.parts.forEach(part => {
                switch (part.type) {
                    case RenamePartType.NOTHING:
                        break;
                    case RenamePartType.TEXT:
                        this.validateRenamePartText(part.value);
                        break;
                    case RenamePartType.NUMBER_FROM:
                        this.validateRenamePartNumberFrom(part.value);
                        break;
                    case RenamePartType.ORIGINAL_FILENAME:
                        break;
                }
            });
        }
    }


    private validateRenamePartText(value: string) {
        if (!value || value.length === 0) {
            throw "Value of rename part 'text' must not be empty.";
        }
    }


    private validateRenamePartNumberFrom(value: string) {
        if (!value || value.length === 0) {
            throw "Value of rename part 'number from' must not be empty.";
        }
        if (isNaN(parseInt(value, 10))) {
            throw "Value of rename part 'number from' must be a valid number.";
        }
    }


}
