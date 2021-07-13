import {app, BrowserWindow} from "electron";
import {LibraryService} from "./service/libraryService";
import DataAccess from "./persistence/dataAccess";
import {WindowService} from "./service/windowService";
import {LibraryDataAccess} from "./persistence/libraryDataAccess";
import {ConfigDataAccess} from "./persistence/configDataAccess";
import {ItemService} from "./service/ItemService";
import {ItemDataAccess} from "./persistence/itemDataAccess";
import {FileSystemWrapper} from "./service/utils/fileSystemWrapper";
import {ImportStepThumbnail} from "./service/importprocess/importStepThumbnail";
import {ImportStepRename} from "./service/importprocess/importStepRename";
import {ImportStepImportTarget} from "./service/importprocess/importStepImportTarget";
import {ImportStepFileHash} from "./service/importprocess/importStepFileHash";
import {ImportDataValidator} from "./service/importprocess/importDataValidator";
import {ImportService} from "./service/importprocess/importService";
import {CollectionDataAccess} from "./persistence/collectionDataAccess";
import {CollectionService} from "./service/collectionService";
import {GroupService} from "./service/groupService";
import {GroupDataAccess} from "./persistence/groupDataAccess";
import {ApplicationService} from "./service/applicationService";
import {ImportStepMetadata} from "./service/importprocess/importStepMetadata";
import {MainApplicationMsgHandler} from "../common/messagingNew/applicationMsgHandler";
import {MainLibraryMsgHandler} from "../common/messagingNew/libraryMsgHandler";
import {MainItemMsgHandler} from "../common/messagingNew/itemMsgHandler";
import {MainCollectionMsgHandler} from "../common/messagingNew/collectionMsgHandler";
import {MainGroupMsgHandler} from "../common/messagingNew/groupMsgHandler";
import {MainItemMsgSender} from "../common/messagingNew/itemMsgSender";
import {mainIpcWrapper} from "../common/messagingNew/core/msgUtils";

const log = require("electron-log");
Object.assign(console, log.functions);

console.log("log filepath:", log.transports.file.file);

// utils
const fsWrapper: FileSystemWrapper = new FileSystemWrapper();

// msg sender
const itemMsgSender: MainItemMsgSender = new MainItemMsgSender(null);

// data access
const configDataAccess: ConfigDataAccess = new ConfigDataAccess();
const dataAccess: DataAccess = new DataAccess();
const libraryDataAccess: LibraryDataAccess = new LibraryDataAccess(dataAccess);
const itemDataAccess: ItemDataAccess = new ItemDataAccess(dataAccess);
const collectionDataAccess: CollectionDataAccess = new CollectionDataAccess(dataAccess, itemDataAccess);
const groupDataAccess: GroupDataAccess = new GroupDataAccess(dataAccess);

// service
const appService: ApplicationService = new ApplicationService(configDataAccess);
const libraryService: LibraryService = new LibraryService(libraryDataAccess, configDataAccess);
const windowService: WindowService = new WindowService(appService);
const itemService: ItemService = new ItemService(
	new ImportService(
		itemDataAccess,
		new ImportDataValidator(fsWrapper),
		new ImportStepRename(),
		new ImportStepImportTarget(fsWrapper),
		new ImportStepFileHash(fsWrapper),
		new ImportStepThumbnail(),
		new ImportStepMetadata(configDataAccess),
		windowService,
		itemMsgSender
	),
	itemDataAccess,
	collectionDataAccess
);
const collectionService: CollectionService = new CollectionService(itemService, collectionDataAccess);
const groupService: GroupService = new GroupService(itemService, collectionService, collectionDataAccess, groupDataAccess);

// message-handler
new MainApplicationMsgHandler(appService, windowService).init();
new MainLibraryMsgHandler(libraryService, windowService).init();
new MainItemMsgHandler(itemService).init();
new MainCollectionMsgHandler(collectionService).init();
new MainGroupMsgHandler(groupService).init();

// let workerWindow: BrowserWindow | null = null;

app.whenReady()
	.then(() => {
		windowService.whenReady()
		.then((window: BrowserWindow) => {
			itemMsgSender.setIpcWrapper(mainIpcWrapper(window))
			itemMsgSender.init();
		})
		//
		// workerWindow = new BrowserWindow({
		// 	show: true,
		// 	width: 200,
		// 	height: 200,
		// 	webPreferences: {
		// 		nodeIntegration: true,
		// 		devTools: true
		// 	},
		// })
		// workerWindow.webContents.openDevTools();
		// workerWindow.loadURL('http://localhost:8080?worker=true');
		// console.log("opened worker window")
		//
		// pingSender = new MainPingMsgSender(workerWindow)
		// pingHandler.init();
		//
		// workerWindow.webContents.once("did-finish-load", () => {
		//     console.log("MAIN PING RENDER", "hello from main")
		// 	pingSender.ping("hello from main")
		// 		.then((response: any) => console.log("RESPONSE FROM RENDER:", response))
		// 		.catch((err: any) => console.log("ERROR FROM RENDER:", err))
		// })
	});

app.on("window-all-closed", () => windowService.allWindowsClosed());
app.on("activate", () => windowService.activate());


