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

const log = require('electron-log');
Object.assign(console, log.functions);

const RUN_TESTS = false;

if (RUN_TESTS) {
    SimpleLibraryTests.runAll();

} else {

    // data access
    const dataAccess: DataAccess = new DataAccess();
    const libraryDataAccess: LibraryDataAccess = new LibraryDataAccess(dataAccess);
    const itemDataAccess: ItemDataAccess = new ItemDataAccess(dataAccess);
    const configDataAccess: ConfigDataAccess = new ConfigDataAccess();

    // service
    const appService: LibraryService = new LibraryService(libraryDataAccess, configDataAccess);
    const itemService: ItemService = new ItemService(itemDataAccess);
    const windowService: WindowService = new WindowService();

    // messaging
    const messageHandler: MessageHandler = new MessageHandler(appService, itemService, windowService);

    messageHandler.initialize();
    app.whenReady().then(() => windowService.whenReady());
    app.on('window-all-closed', () => windowService.allWindowsClosed());
    app.on('activate', () => windowService.activate());

}


