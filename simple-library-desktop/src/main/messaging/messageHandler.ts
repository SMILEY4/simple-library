import {
    onRequestCreateLibrary,
    onRequestLibraryMetadata,
    onRequestOpenLibrary,
    onRequestSwitchToWelcomeScreen,
    Response,
    ResponseStatus,
    switchedToWelcomeScreen,
} from './messages';
import { BrowserWindow, ipcMain } from 'electron';
import { AppService } from '../service/appService';
import { WindowService } from '../windows/windowService';
import { LibraryMetadata } from '../persistence/libraryDataAccess';

export class MessageHandler {

    windowService: WindowService;
    appService: AppService;


    constructor(appService: AppService, windowService: WindowService) {
        this.appService = appService;
        this.windowService = windowService;
    }


    public initialize(): void {
        onRequestCreateLibrary(ipcMain, (path, name) => this.handleRequestCreateLibrary(path, name));
        onRequestOpenLibrary(ipcMain, (path) => this.handleRequestOpenLibrary(path));
        onRequestLibraryMetadata(ipcMain, () => this.handleRequestLibraryMetadata());
        onRequestSwitchToWelcomeScreen(ipcMain, () => this.handleRequestSwitchToWelcomeScreen());
    }


    private async handleRequestCreateLibrary(path: string, name: string): Promise<Response> {
        return this.appService.createLibrary(path, name)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return {
                    status: ResponseStatus.SUCCESS,
                };
            })
            .catch(err => {
                return {
                    status: ResponseStatus.FAILED,
                    body: err,
                };
            });
    }

    private async handleRequestOpenLibrary(path: string) {
        return this.appService.openLibrary(path)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return {
                    status: ResponseStatus.SUCCESS,
                };
            })
            .catch(err => {
                return {
                    status: ResponseStatus.FAILED,
                    body: err,
                };
            });
    }

    private async handleRequestLibraryMetadata(): Promise<Response> {
        return this.appService.getLibraryMetadata()
            .then((data: LibraryMetadata) => {
                return {
                    status: ResponseStatus.SUCCESS,
                    body: data,
                };
            })
            .catch(err => {
                return {
                    status: ResponseStatus.FAILED,
                    body: err,
                };
            });
    }

    private handleRequestSwitchToWelcomeScreen(): void {
        const window: BrowserWindow = this.windowService.switchToSmallWindow();
        if (window) {
            this.appService.disposeLibrary();
            switchedToWelcomeScreen(window);
        }
    }

}