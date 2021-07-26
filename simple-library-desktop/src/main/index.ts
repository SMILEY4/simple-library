import {app, BrowserWindow} from "electron";
import {WindowService} from "./service/windowService";
import {ConfigDataAccess} from "./persistence/configDataAccess";
import {ApplicationService} from "./service/applicationService";
import {WorkerHandler} from "./workerHandler";
import {MessageProxy} from "./messaging/messageProxy";

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (main):", log.transports.file.getFile().path);


const configDataAccess: ConfigDataAccess = new ConfigDataAccess();

// service
const appService: ApplicationService = new ApplicationService(configDataAccess);
const windowService: WindowService = new WindowService(appService);

// worker
const workerHandler: WorkerHandler = new WorkerHandler();

// message-handler
new MessageProxy(windowService, () => workerHandler.getWorkerWindow());


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
