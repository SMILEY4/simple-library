import {
    failedResponse,
    onRequestCloseCurrentLibrary,
    onRequestCreateLibrary,
    onRequestLastOpened,
    onRequestLibraryMetadata,
    onRequestOpenLibrary,
    Response,
    successResponse,
} from './messages';
import { ipcMain } from 'electron';
import { AppService } from '../service/appService';
import { WindowService } from '../windows/windowService';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../models/commonModels';

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
        onRequestLastOpened(ipcMain, () => this.handleRequestLastOpened());
        onRequestCloseCurrentLibrary(ipcMain, () => this.handleRequestCloseCurrentProject());
    }


    private async handleRequestCreateLibrary(path: string, name: string): Promise<Response> {
        return this.appService.createLibrary(path, name)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return successResponse();
            })
            .catch(err => failedResponse(err));
    }

    private async handleRequestOpenLibrary(path: string) {
        return this.appService.openLibrary(path)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return successResponse();
            })
            .catch(err => failedResponse(err));
    }

    private async handleRequestLibraryMetadata(): Promise<Response> {
        return this.appService.getLibraryMetadata()
            .then((data: LibraryMetadata) => successResponse(data))
            .catch(err => failedResponse(err));
    }

    private async handleRequestLastOpened(): Promise<Response> {
        return this.appService.getLibrariesLastOpened()
            .then((data: LastOpenedLibraryEntry[]) => successResponse(data))
            .catch(err => failedResponse(err));
    }

    private async handleRequestCloseCurrentProject(): Promise<Response> {
        this.windowService.switchToSmallWindow();
        this.appService.disposeLibrary();
        return successResponse();
    }

}