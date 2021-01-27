import { app } from 'electron';
import { MessageHandler } from './messaging/messageHandler';
import { AppService } from './service/appService';
import DataAccess from './persistence/dataAccess';
import { WindowService } from './windows/windowService';
import { LibraryDataAccess } from './persistence/libraryDataAccess';
import { ConfigDataAccess } from './persistence/configDataAccess';

const log = require('electron-log');
Object.assign(console, log.functions);

// data access
const dataAccess: DataAccess = new DataAccess();
const libraryDataAccess: LibraryDataAccess = new LibraryDataAccess(dataAccess);
const configDataAccess: ConfigDataAccess = new ConfigDataAccess();

// service
const appService: AppService = new AppService(libraryDataAccess, configDataAccess);
const windowService: WindowService = new WindowService();

// messaging
const messageHandler: MessageHandler = new MessageHandler(appService, windowService);

messageHandler.initialize();
app.whenReady().then(() => windowService.whenReady());
app.on('window-all-closed', () => windowService.allWindowsClosed());
app.on('activate', () => windowService.activate());
