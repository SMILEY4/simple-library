import {
    onRequestCreateLibrary,
    onRequestSwitchToWelcomeScreen,
    SuccessResponse,
    switchedToWelcomeScreen,
} from './messages';
import DataAccess from './persistence/dataAccess';
import { BrowserWindow, ipcMain, screen } from 'electron';

export class MessageHandler {

    browserWindow: BrowserWindow

    constructor(browserWindow: BrowserWindow) {

        onRequestSwitchToWelcomeScreen(ipcMain, () => {
            if (browserWindow) {
                browserWindow.setSize(680, 420);
                browserWindow.setResizable(false);
                browserWindow.center();
                switchedToWelcomeScreen(browserWindow);
            }
        });

        onRequestCreateLibrary(ipcMain, (path: string, name: string) => {
            const filePath: string = DataAccess.createLibrary(path, name);
            if (browserWindow) {
                // const windowBounds = browserWindow.getBounds()
                // const currentScreen = screen.getDisplayNearestPoint({x: windowBounds.x, y: windowBounds.y})
                const cursor = screen.getCursorScreenPoint();
                const currentScreen = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
                const { width, height } = currentScreen.workAreaSize;
                browserWindow.setResizable(true);
                browserWindow.setSize(width, height);
                browserWindow.setPosition(0, 0);
            }
            const response: SuccessResponse = {
                payload: {
                    filePath: filePath,
                },
            };
            return response;
        });
    }


    handleRequestSwitchToWelcomeScreen(): void {
        if (browserWindow) {
            browserWindow.setSize(680, 420);
            browserWindow.setResizable(false);
            browserWindow.center();
            switchedToWelcomeScreen(browserWindow);
        }
    }



}