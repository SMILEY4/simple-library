import { app, BrowserWindow } from 'electron';

const isDev: boolean = !app.isPackaged;

export class WindowService {

    window: BrowserWindow;


    public whenReady() {
        this.createWindow();
    }


    public allWindowsClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }


    public activate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.createWindow();
        }
    }


    public switchToSmallWindow(): BrowserWindow {
        // todo: temp for dev
        // this.window.setSize(680, 420);
        // this.window.setResizable(false);
        // this.window.center();
        return this.window;
    }


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