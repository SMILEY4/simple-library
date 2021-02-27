import { ItemDataAccess } from '../../../persistence/itemDataAccess';
import { ImportDataValidator } from './importDataValidator';
import { ImportStepFileHash } from './importStepFileHash';
import { ImportStepThumbnail } from './importStepThumbnail';
import { ImportStepRename } from './importStepRename';
import { ImportStepImportTarget } from './importStepImportTarget';
import { ImportProcessData, ImportResult, ItemData } from '../../../../common/commonModels';
import { startAsync } from '../../../../common/AsyncCommon';

export class ImportService {

    itemDataAccess: ItemDataAccess;
    importDataValidator: ImportDataValidator;
    importStepFileHash: ImportStepFileHash;
    importStepThumbnail: ImportStepThumbnail;
    importStepRename: ImportStepRename;
    importStepImportTarget: ImportStepImportTarget;


    constructor(itemDataAccess: ItemDataAccess,
                importDataValidator: ImportDataValidator,
                importStepRename: ImportStepRename,
                importStepImportTarget: ImportStepImportTarget,
                importStepFileHash: ImportStepFileHash,
                importStepThumbnail: ImportStepThumbnail) {
        this.itemDataAccess = itemDataAccess;
        this.importDataValidator = importDataValidator;
        this.importStepFileHash = importStepFileHash;
        this.importStepThumbnail = importStepThumbnail;
        this.importStepRename = importStepRename;
        this.importStepImportTarget = importStepImportTarget;
    }

    public async importFiles(data: ImportProcessData): Promise<ImportResult> {
        const importResult: ImportResult = {
            timestamp: Date.now(),
            amountFiles: data.files.length,
            failed: false,
            failureReason: '',
            encounteredErrors: false,
            filesWithErrors: [],
        };
        try {
            console.log("starting import-process of " + data.files.length + " files.");
            this.importDataValidator.validate(data);
            for (let i = 0; i < data.files.length; i++) {
                await startAsync()
                    .then(() => console.log("importing file: " + data.files[i]))
                    .then(() => ImportService.buildBaseItemData(data.files[i]))
                    .then((item: ItemData) => this.importStepRename.handle(item, data.importTarget, data.renameInstructions, i))
                    .then((item: ItemData) => this.importStepImportTarget.handle(item, data.importTarget.action))
                    .then((item: ItemData) => this.importStepFileHash.handle(item))
                    .then((item: ItemData) => this.importStepThumbnail.handle(item))
                    .then((item: ItemData) => this.itemDataAccess.insertItem(item))
                    .then(() => console.log("done importing file: " + data.files[i]))
                    .catch((error: any) => {
                        console.error("Error while importing file " + data.files[i] + ": " + error);
                        importResult.encounteredErrors = true;
                        importResult.filesWithErrors.push([data.files[i], error]);
                    });
            }
            console.log("import-process complete.");
        } catch (err) {
            importResult.failed = true;
            importResult.failureReason = JSON.stringify(err);
        }
        return importResult;
    }

    private static buildBaseItemData(filepath: string) {
        return {
            timestamp: Date.now(),
            sourceFilepath: filepath,
            filepath: filepath,
        };
    }

}