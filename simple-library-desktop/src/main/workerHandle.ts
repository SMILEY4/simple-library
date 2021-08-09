import {BrowserWindow} from "electron";

const WORKER_WINDOW_CONFIG = (show: boolean) => ({
	options: {
		show: false,  // TODO: temp, = show
		width: 200,
		height: 200,
		title: "SimpleLibrary.Worker",
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
			backgroundThrottling: false,
			additionalArguments: ["--worker"]
		}
	}
});

export class WorkerHandle {

	private readonly devMode: boolean;
	private window: BrowserWindow = null;


	constructor(devMode: boolean) {
		this.devMode = devMode;
	}


	public getWindow(): BrowserWindow | null {
		return this.window;
	}


	public create() {
		this.window = this.createWindow();
		this.window.on("closed", this.handleWindowClosed);
	}


	private createWindow(): BrowserWindow {
		const window: BrowserWindow = new BrowserWindow(WORKER_WINDOW_CONFIG(this.devMode).options);
		this.loadContent(window);
		if (this.devMode) {
			this.enableAutoOpenDevTools(window);
		}
		return window;
	}


	private loadContent(window: BrowserWindow) {
		Promise.resolve()
			.then(() => this.devMode
				? window.loadURL("http://localhost:8080")
				: window.loadFile("./.webpack/renderer/index.html"))
			.then(() => window.setTitle("Simple Library"));
	}


	private enableAutoOpenDevTools(window: BrowserWindow) {
		window.webContents.on("did-frame-finish-load", () => {
			window.webContents.openDevTools();
		});
	}


	private handleWindowClosed() {
		this.window = null;
	}

}
