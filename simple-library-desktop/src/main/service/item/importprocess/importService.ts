import { ItemDataAccess } from '../../../persistence/itemDataAccess';
import { ImportDataValidator } from './importDataValidator';
import { ImportStepFileHash } from './importStepFileHash';
import { ImportStepThumbnail } from './importStepThumbnail';
import { ImportStepRename } from './importStepRename';
import { ImportStepImportTarget } from './importStepImportTarget';
import { Collection, ImportProcessData, ImportResult, ItemData } from '../../../../common/commonModels';
import { startAsync } from '../../../../common/AsyncCommon';
import { WindowService } from '../../../windows/windowService';
import { ImportStatusUpdateCommand } from '../../../messaging/messagesLibrary';
import { CollectionDataAccess } from '../../../persistence/collectionDataAccess';

export class ImportService {

    itemDataAccess: ItemDataAccess;
    importDataValidator: ImportDataValidator;
    importStepFileHash: ImportStepFileHash;
    importStepThumbnail: ImportStepThumbnail;
    importStepRename: ImportStepRename;
    importStepImportTarget: ImportStepImportTarget;
    windowService: WindowService;
    collectionDataAccess: CollectionDataAccess;

    importRunning: boolean = false;


    constructor(itemDataAccess: ItemDataAccess,
                importDataValidator: ImportDataValidator,
                importStepRename: ImportStepRename,
                importStepImportTarget: ImportStepImportTarget,
                importStepFileHash: ImportStepFileHash,
                importStepThumbnail: ImportStepThumbnail,
                windowService: WindowService,
                collectionDataAccess: CollectionDataAccess) {
        this.itemDataAccess = itemDataAccess;
        this.importDataValidator = importDataValidator;
        this.importStepFileHash = importStepFileHash;
        this.importStepThumbnail = importStepThumbnail;
        this.importStepRename = importStepRename;
        this.importStepImportTarget = importStepImportTarget;
        this.windowService = windowService;
        this.collectionDataAccess = collectionDataAccess;
    }

    public async importFiles(data: ImportProcessData): Promise<ImportResult> {
        if (this.importRunning) {
            return {
                timestamp: Date.now(),
                amountFiles: 0,
                failed: true,
                failureReason: 'Can not start import while another import is already running.',
                encounteredErrors: false,
                filesWithErrors: [],
            };
        }
        this.importRunning = true;
        const totalAmountFiles: number = data.files.length;
        const importResult: ImportResult = {
            timestamp: Date.now(),
            amountFiles: totalAmountFiles,
            failed: false,
            failureReason: '',
            encounteredErrors: false,
            filesWithErrors: [],
        };
        try {
            console.log("starting import-process of " + totalAmountFiles + " files.");
            this.importDataValidator.validate(data);
            for (let i = 0; i < totalAmountFiles; i++) {
                const currentFile: string = data.files[i];
                await startAsync()
                    .then(() => console.log("importing file: " + currentFile))
                    .then(() => ImportService.buildBaseItemData(currentFile))
                    .then((item: ItemData) => this.importStepRename.handle(item, data.importTarget, data.renameInstructions, i))
                    .then((item: ItemData) => this.importStepImportTarget.handle(item, data.importTarget.action))
                    .then((item: ItemData) => this.importStepFileHash.handle(item))
                    .then((item: ItemData) => this.importStepThumbnail.handle(item))
                    .then((item: ItemData) => this.itemDataAccess.insertItem(item))
                    .then((item: ItemData) => { // todo: temp, for testing purposes
                        this.collectionDataAccess.getCollections()
                            .then((collections: Collection[]) => collections[Math.floor((Math.random() * collections.length))])
                            .then((collection: Collection) => this.collectionDataAccess.addItemToCollection(collection.id, item.id));
                    })
                    .then(() => console.log("done importing file: " + currentFile))
                    .catch((error: any) => {
                        console.error("Error while importing file " + currentFile + ": " + error);
                        importResult.encounteredErrors = true;
                        importResult.filesWithErrors.push([currentFile, error]);
                    });
                ImportStatusUpdateCommand.send(this.windowService.window, {
                    totalAmountFiles: totalAmountFiles,
                    completedFiles: i + 1,
                });
            }
            console.log("import-process complete.");
        } catch (err) {
            importResult.failed = true;
            importResult.failureReason = JSON.stringify(err);
        } finally {
            this.importRunning = false;
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