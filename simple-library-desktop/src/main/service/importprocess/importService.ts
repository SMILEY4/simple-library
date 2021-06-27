import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportDataValidator } from './importDataValidator';
import { ImportStepFileHash } from './importStepFileHash';
import { ImportStepThumbnail } from './importStepThumbnail';
import { ImportStepRename } from './importStepRename';
import { ImportStepImportTarget } from './importStepImportTarget';
import { ImportProcessData, ImportResult, ItemData } from '../../../common/commonModels';
import { startAsync } from '../../../common/AsyncCommon';
import { WindowService } from '../windowService';
import { ImportStatusUpdateCommand } from '../../../common/messaging/messagesItems';
import {ImportStepMetadata} from "./importStepMetadata";

export class ImportService {

    itemDataAccess: ItemDataAccess;
    importDataValidator: ImportDataValidator;
    importStepFileHash: ImportStepFileHash;
    importStepThumbnail: ImportStepThumbnail;
    importStepRename: ImportStepRename;
    importStepImportTarget: ImportStepImportTarget;
    importStepMetadata: ImportStepMetadata;
    windowService: WindowService;

    /**
     * True, when an import is currently running
     */
    importRunning: boolean = false;


    constructor(itemDataAccess: ItemDataAccess,
                importDataValidator: ImportDataValidator,
                importStepRename: ImportStepRename,
                importStepImportTarget: ImportStepImportTarget,
                importStepFileHash: ImportStepFileHash,
                importStepThumbnail: ImportStepThumbnail,
                importStepMetadata: ImportStepMetadata,
                windowService: WindowService) {
        this.itemDataAccess = itemDataAccess;
        this.importDataValidator = importDataValidator;
        this.importStepFileHash = importStepFileHash;
        this.importStepThumbnail = importStepThumbnail;
        this.importStepRename = importStepRename;
        this.importStepImportTarget = importStepImportTarget;
        this.importStepMetadata = importStepMetadata;
        this.windowService = windowService;
    }


    /**
     * Imports file(s) as specified in the given import process data
     * @param data the data specifying what and how to import
     * @return a promise that resolves with the result of the import process
     */
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
                    .then((item: ItemData) => this.importStepMetadata.handle(item))
                    // .then((item: ItemData) => this.itemDataAccess.insertItem(item))
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