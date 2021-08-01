import {app} from "electron";
import {ConfigDataAccess} from "./configDataAccess";
import {MessageProxy} from "./messageProxy";
import {WindowHandle} from "./windowHandle";
import {WorkerHandle} from "./workerHandle";

const isDev: boolean = !app.isPackaged;

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (main):", log.transports.file.getFile().path);

const configDataAccess: ConfigDataAccess = new ConfigDataAccess();
const windowHandle: WindowHandle = new WindowHandle(isDev, configDataAccess);
const workerHandle: WorkerHandle = new WorkerHandle(isDev);
new MessageProxy(() => workerHandle.getWindow());


app.whenReady().then(() => {
	console.debug("ready -> create windows + background-workers");
	windowHandle.openWindow();
	workerHandle.create();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		console.debug("main window closed -> quit");
		app.quit();
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

