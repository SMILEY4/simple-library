import { onRequestCreateLibrary, onRequestSwitchToWelcomeScreen, Response, switchedToWelcomeScreen } from './messages';
import { BrowserWindow, ipcMain } from 'electron';
import { AppService } from '../service/appService';
import { WindowService } from '../windows/windowService';
import { Result } from '../utils/result';

export class MessageHandler {

    windowService: WindowService;
    appService: AppService;


    constructor(appService: AppService, windowService: WindowService) {
        this.appService = appService;
        this.windowService = windowService;
    }


    public initialize(): void {
        onRequestSwitchToWelcomeScreen(ipcMain, () => this.handleRequestSwitchToWelcomeScreen());
        onRequestCreateLibrary(ipcMain, (path, name) => this.handleRequestCreateLibrary(path, name));
    }


    private handleRequestSwitchToWelcomeScreen(): void {
        const window: BrowserWindow = this.windowService.switchToSmallWindow();
        if (window) {
            this.appService.disposeLibrary();
            switchedToWelcomeScreen(window);
        }
    }


    private handleRequestCreateLibrary(path: string, name: string): Response {
        const result: Result = this.appService.createLibrary(path, name);
        if (result.successful) {
            this.windowService.switchToLargeWindow();
            // todo: maybe make difference "error <-> success" more clear ?
            return {
                payload: undefined,
            };
        } else {
            return {
                payload: undefined,
                reason: result.errors.join('. '),
            };
        }
    }

}