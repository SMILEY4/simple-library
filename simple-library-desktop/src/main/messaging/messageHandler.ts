import { failedResponse, Response, successResponse } from './messages';
import { ipcMain } from 'electron';
import { LibraryService } from '../service/library/libraryService';
import { WindowService } from '../windows/windowService';
import {
    ImportTargetAction,
    ImportProcessData,
    ItemData,
    LastOpenedLibraryEntry,
    LibraryMetadata,
} from '../../common/commonModels';
import {
    CloseCurrentLibraryMessage,
    CreateLibraryMessage,
    GetItemsMessage,
    GetLastOpenedLibrariesMessage,
    GetLibraryMetadataMessage,
    ImportFilesMessage,
    OpenLibraryMessage,
} from './messagesLibrary';
import { ItemService } from '../service/item/ItemService';

export class MessageHandler {

    windowService: WindowService;
    appService: LibraryService;
    itemService: ItemService;


    constructor(appService: LibraryService,
                itemService: ItemService,
                windowService: WindowService) {
        this.appService = appService;
        this.itemService = itemService;
        this.windowService = windowService;
    }


    public initialize(): void {
        CreateLibraryMessage.handle(ipcMain, (path, name) => this.handleRequestCreateLibrary(path, name));
        OpenLibraryMessage.handle(ipcMain, (path) => this.handleRequestOpenLibrary(path));
        GetLibraryMetadataMessage.handle(ipcMain, () => this.handleRequestLibraryMetadata());
        GetLastOpenedLibrariesMessage.handle(ipcMain, () => this.handleRequestLastOpened());
        CloseCurrentLibraryMessage.handle(ipcMain, () => this.handleRequestCloseCurrentProject());
        ImportFilesMessage.handle(ipcMain, (data) => this.handleRequestImportFiles(data));
        GetItemsMessage.handle(ipcMain, () => this.handleRequestGetItems());
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
        this.appService.closeCurrentLibrary();
        return successResponse();
    }

    private async handleRequestImportFiles(data: ImportProcessData): Promise<Response> {
        return this.itemService.importFiles(data)
            .then(() => successResponse())
            .catch(err => failedResponse(err));
    }

    private async handleRequestGetItems(): Promise<Response> {
        return this.itemService.getAllItems()
            .then((items: ItemData[]) => successResponse(items))
            .catch(err => failedResponse(err));
    }

}