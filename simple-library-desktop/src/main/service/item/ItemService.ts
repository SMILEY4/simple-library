import { startAsync } from '../../../common/AsyncCommon';
import { ImportStepFileHash } from './importprocess/importStepFileHash';
import { ImportStepThumbnail } from './importprocess/importStepThumbnail';
import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportProcessData, ItemData } from '../../../common/commonModels';
import { ImportStepImportTarget } from './importprocess/importStepImportTarget';
import { ImportStepRename } from './importprocess/importStepRename';
import { ImportDataValidator } from './importprocess/importDataValidator';

export class ItemService {

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
        this.importStepFileHash = importStepFileHash;
        this.importStepThumbnail = importStepThumbnail;
        this.importStepRename = importStepRename;
        this.importStepImportTarget = importStepImportTarget;
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems();
    }

    public async importFiles(data: ImportProcessData): Promise<void> {
        console.log("starting import-process of " + data.files.length + " files.");
        this.importDataValidator.validate(data);
        for (let i = 0; i < data.files.length; i++) {
            await startAsync()
                .then(() => console.log("importing file: " + data.files[i]))
                .then(() => ItemService.buildBaseItemData(data.files[i]))
                .then((item: ItemData) => this.importStepRename.handle(item, data.importTarget, data.renameInstructions, i))
                .then((item: ItemData) => this.importStepImportTarget.handle(item, data.importTarget.action))
                .then((item: ItemData) => this.importStepFileHash.handle(item))
                .then((item: ItemData) => this.importStepThumbnail.handle(item))
                .then((item: ItemData) => this.itemDataAccess.insertItem(item))
                .then(() => console.log("done importing file: " + data.files[i]))
                .catch((error) => console.error("Error while importing file " + data.files[i] + ": " + error));
        }
        console.log("import-process complete.");
    }

    private static buildBaseItemData(filepath: string) {
        return {
            timestamp: Date.now(),
            sourceFilepath: filepath,
            filepath: filepath,
        };
    }

}