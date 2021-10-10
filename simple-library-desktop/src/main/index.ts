import {app} from "electron";
import {ConfigDataAccess} from "./configDataAccess";
import {WindowHandle} from "./windowHandle";
import {WorkerHandle} from "./workerHandle";
import {EventProxy} from "../common/events/core/eventProxy";
import {EventIds} from "../common/events/eventIds";
import {initWorker} from "../worker/setup";

const IS_DEV: boolean = !app.isPackaged;
const WORKER_IN_MAIN: boolean = IS_DEV;

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (main):", log.transports.file.getFile().path);

const configDataAccess: ConfigDataAccess = new ConfigDataAccess();
const windowHandle: WindowHandle = new WindowHandle(IS_DEV, configDataAccess);
const workerHandle: WorkerHandle = new WorkerHandle(IS_DEV);

if (!WORKER_IN_MAIN) {
    new EventProxy(
        {
            eventIds: EventIds.ALL_IDS,
            comPartner: {
                partner: "renderer",
                window: () => windowHandle.getWindow(),
            },
            eventIdPrefix: "r",
            suppressPayloadLog: "all",
        },
        {
            comPartner: {
                partner: "renderer",
                window: () => workerHandle.getWindow(),
            },
            eventIdPrefix: "w",
            suppressPayloadLog: "all",
        }
    );

    new EventProxy(
        {
            eventIds: EventIds.ALL_IDS,
            comPartner: {
                partner: "renderer",
                window: () => workerHandle.getWindow(),
            },
            eventIdPrefix: "w",
            suppressPayloadLog: "all",
        },
        {
            comPartner: {
                partner: "renderer",
                window: () => windowHandle.getWindow(),
            },
            eventIdPrefix: "r",
            suppressPayloadLog: "all",
        }
    );
}

app.whenReady().then(() => {
    console.debug("ready -> create windows + background-workers");
    windowHandle.openWindow();
    if (WORKER_IN_MAIN) {
        initWorker(IS_DEV, true, () => windowHandle.getWindow())
    } else {
        workerHandle.create();
    }
});

function handleWindowsClosed() {
    if (process.platform !== "darwin") {
        console.debug("all windows closed -> quit");
        app.quit();
    }
}

app.on("window-all-closed", handleWindowsClosed);
windowHandle.onWindowClosed(handleWindowsClosed);

