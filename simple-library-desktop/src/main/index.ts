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
import {mainIpcWrapper} from "../common/messaging/core/msgUtils";
import {MainApplicationMsgHandler} from "./messaging/mainApplicationMsgHandler";
import {MainLibraryMsgHandler} from "./messaging/mainLibraryMsgHandler";
import {MainItemMsgHandler} from "./messaging/mainItemMsgHandler";
import {MainCollectionMsgHandler} from "./messaging/mainCollectionMsgHandler";
import {MainGroupMsgHandler} from "./messaging/mainGroupMsgHandler";
import {WorkerHandler} from "./workerHandler";
import {ItemsImportStatusChannel} from "../common/messaging/channels/channels";

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (main):", log.transports.file.getFile().path);

// utils
const fsWrapper: FileSystemWrapper = new FileSystemWrapper();

// msg sender
// const channelImportStatus: ItemsImportStatusChannel = new ItemsImportStatusChannel(null);

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
const channelImportStatus: ItemsImportStatusChannel = new ItemsImportStatusChannel(mainIpcWrapper(() => windowService.getMainWindow()));
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
		channelImportStatus
	),
	itemDataAccess,
	collectionDataAccess
);
const collectionService: CollectionService = new CollectionService(itemService, collectionDataAccess);
const groupService: GroupService = new GroupService(itemService, collectionService, collectionDataAccess, groupDataAccess);


// worker
const workerHandler: WorkerHandler = new WorkerHandler();

// message-handler
new MainApplicationMsgHandler(appService, windowService, () => workerHandler.getWorkerWindow());
new MainLibraryMsgHandler(libraryService, windowService);
new MainItemMsgHandler(itemService);
new MainCollectionMsgHandler(collectionService);
new MainGroupMsgHandler(groupService);


// setup
onReady(() => {
	console.debug("ready -> create windows + background-workers");
	windowService.setup();
	workerHandler.setupWorker(true);

	onActivate(() => {
		if (BrowserWindow.getAllWindows().length === 0) {
			console.debug("re-activated -> recreate windows + workers");
			workerHandler.setupWorker(true);
		}
	});

});

onMainWindowsClosed(() => {
	if (process.platform !== "darwin") {
		console.debug("main window closed -> quit");
		app.quit();
	}
});

onAllWindowsClosed(() => {
	if (process.platform !== "darwin") {
		console.debug("all windows closed -> quit");
		app.quit();
	}
});


// utils
function onReady(callback: () => void): void {
	app.whenReady().then(() => callback());
}

function onActivate(callback: () => void): void {
	app.on("activate", () => callback());
}

function onAllWindowsClosed(callback: () => void): void {
	app.on("window-all-closed", () => callback());
}

function onMainWindowsClosed(callback: () => void): void {
	windowService.onWindowClosed(() => callback());
}