import {BrowserWindow} from "electron";

export class WorkerHandler {

	private window: BrowserWindow;

	public setupWorker(devMode: boolean): void {
		this.window = new BrowserWindow({
			show: devMode,
			width: 200,
			height: 200,
			title: "SimpleLibrary.Worker",
			webPreferences: {
				nodeIntegration: true,
				devTools: true,
				backgroundThrottling: false,
				additionalArguments: ["--worker"]
			}
		});

		if (devMode) {
			this.window.loadURL("http://localhost:8080?worker=true")
				.then(() => this.window.setTitle("SimpleLibrary.Worker"));
			this.window.webContents.on("did-frame-finish-load", () => {
				this.window.webContents.openDevTools();
			});
		} else {
			this.window.loadFile("./.webpack/renderer/index.html");
		}

	}

	public getWorkerWindow(): BrowserWindow {
		return this.window;
	}

}