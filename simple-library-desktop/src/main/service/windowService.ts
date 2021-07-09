import {app, BrowserWindow, nativeTheme} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {ApplicationService} from "./applicationService";

const isDev: boolean = !app.isPackaged;

export class WindowService {

	appService: ApplicationService
	window: BrowserWindow;

	constructor(appService: ApplicationService) {
		this.appService = appService;
	}

	/**
	 * initializes the window (trigger the application is ready)
	 */
	public whenReady() {
		if (isDev) {
			installExtension(REACT_DEVELOPER_TOOLS, {
				loadExtensionOptions: {allowFileAccess: true},
				forceDownload: false
			})
				.then((name) => console.log(`Added Extension:  ${name}`))
				.catch((err) => console.log('An error occurred when adding extension: ', err))
				.then(() => this.createWindow())
		} else {
			this.createWindow();
		}
	}


	/**
	 * Quits the application (trigger when all windows are closed)
	 */
	public allWindowsClosed() {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	}


	/**
	 * Re-initializes the window (trigger on activate)
	 */
	public activate() {
		if (BrowserWindow.getAllWindows().length === 0) {
			this.createWindow();
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
				devTools: true, // isDev,
			},
		});

		this.setApplicationTheme(this.appService.getApplicationTheme())

		if (isDev) {
			this.window.setAlwaysOnTop(true);
			this.window.loadURL('http://localhost:8080?worker=false');
			this.window.webContents.on("did-frame-finish-load", () => {
				this.window.webContents.once("devtools-opened", () => {
					this.window.focus();
				});
				this.window.webContents.openDevTools();
			});
		} else {
			this.window.loadFile('./.webpack/renderer/index.html');
		}
	}


	public setApplicationTheme(theme: "dark" | "light"): void {
		nativeTheme.themeSource = theme
	}

}
