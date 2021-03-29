import { app, BrowserWindow } from 'electron';

const isDev: boolean = !app.isPackaged;

export class WindowService {

    window: BrowserWindow;

    /**
     * initializes the window (trigger the application is ready)
     */
    public whenReady() {
        this.createWindow();
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
            resizable: true, // todo wip: only for testing (normally = false)
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                webSecurity: false,
                devTools: process.env.NODE_ENV !== 'production',
            },
        });

        this.window.setAlwaysOnTop(true);
        if (isDev) {
            this.window.loadURL('http://localhost:8080');
            this.window.webContents.openDevTools();
        } else {
            this.window.loadFile('./.webpack/renderer/index.html');
        }
    }

}