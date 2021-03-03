import { app } from 'electron';
import { MessageHandler } from './messaging/messageHandler';
import { LibraryService } from './service/library/libraryService';
import DataAccess from './persistence/dataAccess';
import { WindowService } from './windows/windowService';
import { LibraryDataAccess } from './persistence/libraryDataAccess';
import { ConfigDataAccess } from './persistence/configDataAccess';
import { ItemService } from './service/item/ItemService';
import { ItemDataAccess } from './persistence/itemDataAccess';
import { SimpleLibraryTests } from '../tests/simpleLibraryTests';
import { FileSystemWrapper } from './service/utils/fileSystemWrapper';
import { ImportStepThumbnail } from './service/item/importprocess/importStepThumbnail';
import { ImportStepRename } from './service/item/importprocess/importStepRename';
import { ImportStepImportTarget } from './service/item/importprocess/importStepImportTarget';
import { ImportStepFileHash } from './service/item/importprocess/importStepFileHash';
import { ImportDataValidator } from './service/item/importprocess/importDataValidator';
import { ImportService } from './service/item/importprocess/importService';
import { CollectionDataAccess } from './persistence/collectionDataAccess';
import { CollectionService } from './service/collection/collectionService';

const RUN_TESTS = false;

if (RUN_TESTS) {
    SimpleLibraryTests.runAll().then(() => {
    });

} else {

    const log = require('electron-log');
    Object.assign(console, log.functions);

    // utils
    const fsWrapper: FileSystemWrapper = new FileSystemWrapper();

    // data access
    const configDataAccess: ConfigDataAccess = new ConfigDataAccess();
    const dataAccess: DataAccess = new DataAccess();
    const libraryDataAccess: LibraryDataAccess = new LibraryDataAccess(dataAccess);
    const itemDataAccess: ItemDataAccess = new ItemDataAccess(dataAccess);
    const collectionDataAccess: CollectionDataAccess = new CollectionDataAccess(dataAccess);

    // service
    const appService: LibraryService = new LibraryService(libraryDataAccess, configDataAccess);
    const windowService: WindowService = new WindowService();
    const itemService: ItemService = new ItemService(
        itemDataAccess,
        new ImportService(
            itemDataAccess,
            new ImportDataValidator(fsWrapper),
            new ImportStepRename(),
            new ImportStepImportTarget(fsWrapper),
            new ImportStepFileHash(fsWrapper),
            new ImportStepThumbnail(),
            windowService,
            collectionDataAccess
        ),
    );
    const collectionService: CollectionService = new CollectionService(collectionDataAccess);

    // messaging
    const messageHandler: MessageHandler = new MessageHandler(appService, itemService, collectionService, windowService);

    messageHandler.initialize();
    app.whenReady().then(() => windowService.whenReady());
    app.on('window-all-closed', () => windowService.allWindowsClosed());
    app.on('activate', () => windowService.activate());

}


