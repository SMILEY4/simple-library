import {app, BrowserWindow, nativeTheme} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";
import {ApplicationService} from "./applicationService";

const isDev: boolean = !app.isPackaged;

export class WindowService {

	private readonly appService: ApplicationService;
	private window: BrowserWindow;
	private windowCloseListener: () => void | null;


	constructor(appService: ApplicationService) {
		this.appService = appService;
	}

	/**
	 * initializes the window (trigger the application is ready)
	 */
	public setup(): Promise<BrowserWindow> {
		if (isDev) {
			return installExtension(REACT_DEVELOPER_TOOLS, {
				loadExtensionOptions: {allowFileAccess: true},
				forceDownload: false
			})
				.then((name) => console.log(`Added Extension:  ${name}`))
				.catch((err) => console.log("An error occurred when adding extension: ", err))
				.then(() => this.createWindow())
				.then(() => this.window);
		} else {
			this.createWindow();
			return Promise.resolve(this.window);
		}
	}

	/**
	 * Switch to the smaller window setup e.g. of the welcome screen
	 */
	public switchToSmallWindow(): BrowserWindow {
		// todo: temp for dev
		// this.window.setSize(680, 420);
		// this.window.setResizable(false);
		// this.window.center();
		return this.window;
	}


	/**
	 * Switch to the large main window setup
	 */
	public switchToLargeWindow(): BrowserWindow {
		// todo: temp for dev
		// const cursor = screen.getCursorScreenPoint();
		// const currentScreen = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
		// const { width, height } = currentScreen.workAreaSize;
		// this.window.setResizable(true);
		// this.window.setSize(width, height);
		// this.window.setPosition(0, 0);
		return this.window;
	}


	private createWindow() {
		this.window = new BrowserWindow({
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
		});

		this.setApplicationTheme(this.appService.getApplicationTheme());

		if (isDev) {
			this.window.setAlwaysOnTop(true);
			this.window.loadURL("http://localhost:8080");
			this.window.webContents.on("did-frame-finish-load", () => {
				this.window.webContents.once("devtools-opened", () => {
					this.window.focus();
				});
				this.window.webContents.openDevTools();
			});
		} else {
			this.window.loadFile("./.webpack/renderer/index.html");
		}

		this.window.on("closed", () => {
			this.windowCloseListener && this.windowCloseListener();
			this.window = null;
		});

	}

	public setApplicationTheme(theme: "dark" | "light"): void {
		nativeTheme.themeSource = theme;
	}

	public onWindowClosed(callback: () => void): void {
		this.windowCloseListener = callback;
	}

}
