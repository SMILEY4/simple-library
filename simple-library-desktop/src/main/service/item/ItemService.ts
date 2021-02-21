import { startAsync } from '../../../common/AsyncCommon';
import { FileHashCalculator } from './FileHashCalculator';
import { ThumbnailGenerator } from './ThumbnailGenerator';
import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ItemData } from '../../models/commonModels';

export class ItemService {

    itemDataAccess: ItemDataAccess;
    fileHashCalculator: FileHashCalculator;
    thumbnailGenerator: ThumbnailGenerator;


    constructor(itemDataAccess: ItemDataAccess) {
        this.itemDataAccess = itemDataAccess;
        this.fileHashCalculator = new FileHashCalculator();
        this.thumbnailGenerator = new ThumbnailGenerator();
    }

    public async importFiles(files: string[]): Promise<void> {
        console.log("starting import of " + files.length + " files.");
        for (let i = 0; i < files.length; i++) {
            await startAsync()
                .then(() => console.log("importing file: " + files[i]))
                .then(() => ItemService.baseItemData(files[i]))
                .then((data: ItemData) => this.fileHashCalculator.appendHash(data))
                .then((data: ItemData) => this.thumbnailGenerator.appendBase64Thumbnail(data))
                .then((data: ItemData) => this.itemDataAccess.insertItem(data))
                .then(() => console.log("done importing file: " + files[i]))
                .catch((error) => console.error("Error while importing file " + files[i] + ": " + error));
        }
        console.log("import of " + files.length + " complete.");
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