import {
    ErrorResponse,
    onRequestCreateLibrary,
    onRequestSwitchToWelcomeScreen,
    Response,
    SuccessResponse,
    switchedToWelcomeScreen,
} from './messages';
import DataAccess from '../persistence/dataAccess';
import { BrowserWindow, ipcMain, screen } from 'electron';

export class MessageHandler {

    browserWindow: BrowserWindow;

    constructor(browserWindow: BrowserWindow) {
        console.log("INIT MSG HANDLER: "+ browserWindow)
        this.browserWindow = browserWindow;
        onRequestSwitchToWelcomeScreen(ipcMain, this.handleRequestSwitchToWelcomeScreen);
        onRequestCreateLibrary(ipcMain, this.handleRequestCreateLibrary);
    }

    handleRequestSwitchToWelcomeScreen(): void {
        console.log("handleRequestSwitchToWelcomeScreen: "+ this.browserWindow)
        this.browserWindow.setSize(680, 420);
        this.browserWindow.setResizable(false);
        this.browserWindow.center();
        switchedToWelcomeScreen(this.browserWindow);
    }

    handleRequestCreateLibrary(path: string, name: string): Response {
        console.log("handleRequestCreateLibrary: "+ this.browserWindow)
        const filePath: string = DataAccess.createLibrary(path, name);
        // const windowBounds = browserWindow.getBounds()
        // const currentScreen = screen.getDisplayNearestPoint({x: windowBounds.x, y: windowBounds.y})
        const cursor = screen.getCursorScreenPoint();
        const currentScreen = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
        const { width, height } = currentScreen.workAreaSize;
        this.browserWindow.setResizable(true);
        this.browserWindow.setSize(width, height);
        this.browserWindow.setPosition(0, 0);

        const successResponse: SuccessResponse = {
            payload: {
                filePath: filePath,
            },
        };

        const errorResponse: ErrorResponse = {
            payload: undefined,
            reason: 'Some stupid error',
        };

        return successResponse;

    }

}