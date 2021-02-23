import { startAsync } from '../../../common/AsyncCommon';
import { FileHashCalculator } from './import/FileHashCalculator';
import { ThumbnailGenerator } from './import/ThumbnailGenerator';
import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportProcessData, ItemData } from '../../../common/commonModels';
import { ImportFileHandler } from './import/ImportFileHandler';
import { BulkRenameHandler } from './import/BulkRenameHandler';
import { FileSystemWrapper } from '../utils/fileSystemWrapper';

export class ItemService {

    itemDataAccess: ItemDataAccess;
    fileHashCalculator: FileHashCalculator;
    thumbnailGenerator: ThumbnailGenerator;
    bulkRenameHandler: BulkRenameHandler;
    fileMover: ImportFileHandler;


    constructor(itemDataAccess: ItemDataAccess) {
        this.itemDataAccess = itemDataAccess;
        this.fileHashCalculator = new FileHashCalculator();
        this.thumbnailGenerator = new ThumbnailGenerator();
        this.bulkRenameHandler = new BulkRenameHandler();
        this.fileMover = new ImportFileHandler(new FileSystemWrapper());
    }

    public async importFiles(data: ImportProcessData): Promise<void> {
        console.log("starting import of " + data.files.length + " files: action=" + data.fileHandleData.action + ", targetDir=" + data.fileHandleData.targetDir);
        for (let i = 0; i < data.files.length; i++) {
            await startAsync()
                .then(() => console.log("importing file: " + data.files[i]))
                .then(() => ItemService.baseItemData(data.files[i]))
                .then((item: ItemData) => this.bulkRenameHandler.handleImportData(item, data.fileHandleData, data.renameData, i))
                .then((item: ItemData) => this.fileMover.handleFile(item, data.fileHandleData.action))
                .then((item: ItemData) => this.fileHashCalculator.appendHash(item))
                .then((item: ItemData) => this.thumbnailGenerator.appendBase64Thumbnail(item))
                .then((item: ItemData) => this.itemDataAccess.insertItem(item))
                .then(() => console.log("done importing file: " + data.files[i]))
                .catch((error) => console.error("Error while importing file " + data.files[i] + ": " + error));
        }
        console.log("import complete.");
    }

    private static baseItemData(filepath: string) {
        return {
            timestamp: Date.now(),
            orgFilepath: filepath,
            filepath: filepath,
        };
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems();
    }

}