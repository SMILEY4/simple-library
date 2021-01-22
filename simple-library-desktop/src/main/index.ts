import { app } from 'electron';
import { MessageHandler } from './messaging/messageHandler';
import { AppService } from './service/appService';
import DataAccess from './persistence/dataAccess';
import { WindowService } from './windows/windowService';

const log = require('electron-log');
Object.assign(console, log.functions);

const dataAccess: DataAccess = new DataAccess();
const appService: AppService = new AppService(dataAccess);
const windowService: WindowService = new WindowService();
const messageHandler: MessageHandler = new MessageHandler(appService, windowService);

messageHandler.initialize();
app.whenReady().then(() => windowService.whenReady());
app.on('window-all-closed', () => windowService.allWindowsClosed());
app.on('activate', () => windowService.activate());
