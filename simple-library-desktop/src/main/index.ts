import { app } from 'electron';
import { LibraryService } from './service/libraryService';
import DataAccess from './persistence/dataAccess';
import { WindowService } from './service/windowService';
import { LibraryDataAccess } from './persistence/libraryDataAccess';
import { ConfigDataAccess } from './persistence/configDataAccess';
import { ItemService } from './service/ItemService';
import { ItemDataAccess } from './persistence/itemDataAccess';
import { SimpleLibraryTests } from '../tests/simpleLibraryTests';
import { FileSystemWrapper } from './service/utils/fileSystemWrapper';
import { ImportStepThumbnail } from './service/importprocess/importStepThumbnail';
import { ImportStepRename } from './service/importprocess/importStepRename';
import { ImportStepImportTarget } from './service/importprocess/importStepImportTarget';
import { ImportStepFileHash } from './service/importprocess/importStepFileHash';
import { ImportDataValidator } from './service/importprocess/importDataValidator';
import { ImportService } from './service/importprocess/importService';
import { CollectionDataAccess } from './persistence/collectionDataAccess';
import { CollectionService } from './service/collectionService';
import { CollectionMessageHandler } from './messagehandler/collectionMessageHandler';
import { ItemMessageHandler } from './messagehandler/itemMessageHandler';
import { GroupMessageHandler } from './messagehandler/groupMessageHandler';
import { LibraryMessageHandler } from './messagehandler/libraryMessageHandler';
import { GroupService } from './service/groupService';
import { GroupDataAccess } from './persistence/groupDataAccess';

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
    const collectionDataAccess: CollectionDataAccess = new CollectionDataAccess(dataAccess, itemDataAccess);
    const groupDataAccess: GroupDataAccess = new GroupDataAccess(dataAccess);

    // service
    const appService: LibraryService = new LibraryService(libraryDataAccess, configDataAccess);
    const windowService: WindowService = new WindowService();
    const itemService: ItemService = new ItemService(
        new ImportService(
            itemDataAccess,
            new ImportDataValidator(fsWrapper),
            new ImportStepRename(),
            new ImportStepImportTarget(fsWrapper),
            new ImportStepFileHash(fsWrapper),
            new ImportStepThumbnail(),
            windowService,
        ),
        itemDataAccess,
        collectionDataAccess,
    );
    const collectionService: CollectionService = new CollectionService(itemService, collectionDataAccess);
    const groupService: GroupService = new GroupService(itemService, collectionService, collectionDataAccess, groupDataAccess);

    // message-handler
    new LibraryMessageHandler(appService, windowService).initialize();
    new ItemMessageHandler(itemService).initialize();
    new CollectionMessageHandler(collectionService).initialize();
    new GroupMessageHandler(groupService).initialize();


    app.whenReady().then(() => windowService.whenReady());
    app.on('window-all-closed', () => windowService.allWindowsClosed());
    app.on('activate', () => windowService.activate());

}


