import { startAsync } from '../../../common/AsyncCommon';
import { FileHashCalculator } from './import/FileHashCalculator';
import { ThumbnailGenerator } from './import/ThumbnailGenerator';
import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { FileAction, ItemData } from '../../models/commonModels';
import { FileMover } from './import/FileMover';

export class ItemService {

    itemDataAccess: ItemDataAccess;
    fileHashCalculator: FileHashCalculator;
    thumbnailGenerator: ThumbnailGenerator;
    fileMover: FileMover;


    constructor(itemDataAccess: ItemDataAccess) {
        this.itemDataAccess = itemDataAccess;
        this.fileHashCalculator = new FileHashCalculator();
        this.thumbnailGenerator = new ThumbnailGenerator();
        this.fileMover = new FileMover();
    }

    public async importFiles(files: string[], action: FileAction, targetDir: string | undefined): Promise<void> {
        console.log("starting import of " + files.length + " files: action=" + action + ", targetDir=" + targetDir);
        for (let i = 0; i < files.length; i++) {
            await startAsync()
                .then(() => console.log("importing file: " + files[i]))
                .then(() => ItemService.baseItemData(files[i]))
                .then((data: ItemData) => this.fileMover.handleFile(data, action, targetDir))
                .then((data: ItemData) => this.fileHashCalculator.appendHash(data))
                .then((data: ItemData) => this.thumbnailGenerator.appendBase64Thumbnail(data))
                .then((data: ItemData) => this.itemDataAccess.insertItem(data))
                .then(() => console.log("done importing file: " + files[i]))
                .catch((error) => console.error("Error while importing file " + files[i] + ": " + error));
        }
        console.log("import complete.");
    }

    private static baseItemData(filepath: string) {
        return {
            timestamp: Date.now(),
            filepath: filepath,
        };
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems();
    }


}