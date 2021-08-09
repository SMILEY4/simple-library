import {BrowserWindow, nativeTheme} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";
import {ConfigDataAccess} from "./configDataAccess";

const MAIN_WINDOW_CONFIG: any = {
	options: {
		width: 680,
		height: 420,
		resizable: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false,
			enableBlinkFeatures: "CSSColorSchemeUARendering",
			devTools: true // isDev,
		}
	}
};


export class WindowHandle {

	private readonly devMode: boolean;
	private readonly configDataAccess: ConfigDataAccess;

	private window: BrowserWindow = null;
	private closeCallback: (() => void) | null = null;


	constructor(devMode: boolean, configDataAccess: ConfigDataAccess) {
		this.devMode = devMode;
		this.configDataAccess = configDataAccess;
	}


	public static setTheme(theme: "light" | "dark") {
		nativeTheme.themeSource = theme;
	}


	public getWindow(): BrowserWindow | null {
		return this.window;
	}


	public openWindow() {
		Promise.resolve(this.devMode ? this.installExtensions() : undefined)
			.then(() => this.createWindow())
			.then((window: BrowserWindow) => {
				this.window = window;
				window.on("closed", this.handleWindowClosed);
			});
	}


	public onWindowClosed(callback: (() => void) | null) {
		this.closeCallback = callback;
	}


	private installExtensions(): Promise<void> {
		return installExtension(REACT_DEVELOPER_TOOLS, {
			loadExtensionOptions: {allowFileAccess: true},
			forceDownload: false
		})
			.then((name) => console.log("Added Extension: " + name))
			.catch((err) => console.log("An error occurred when adding an extension: ", err));
	}


	private createWindow(): BrowserWindow {
		const window: BrowserWindow = new BrowserWindow(MAIN_WINDOW_CONFIG.options);
		this.setInitialTheme();
		this.loadContent(window);
		if (this.devMode) {
			window.setAlwaysOnTop(true);
			this.enableAutoOpenDevTools(window);
		}
		return window;
	}


	private setInitialTheme() {
		WindowHandle.setTheme(this.configDataAccess.getApplicationTheme() === "dark" ? "dark" : "light");
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
			window.webContents.once("devtools-opened", () => window.focus());
			window.webContents.openDevTools();
		});
	}


	private handleWindowClosed() {
		this.window = null;
		this.closeCallback && this.closeCallback();
	}


}