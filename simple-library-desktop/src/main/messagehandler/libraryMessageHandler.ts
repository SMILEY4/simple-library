import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../../common/commonModels';
import { LibraryService } from '../service/libraryService';
import { WindowService } from '../service/windowService';
import {
    CloseLibraryMessage,
    CreateLibraryMessage,
    GetLastOpenedLibrariesMessage,
    GetLibraryMetadataMessage,
    OpenLibraryMessage,
} from '../../common/messaging/messagesLibrary';

export class LibraryMessageHandler {

    appService: LibraryService;
    windowService: WindowService;

    constructor(appService: LibraryService,
                windowService: WindowService) {
        this.appService = appService;
        this.windowService = windowService;
    }

    public initialize(): void {
        GetLastOpenedLibrariesMessage.handle(ipcMain, payload => this.handleGetLastOpened(payload));
        CreateLibraryMessage.handle(ipcMain, payload => this.handleCreate(payload));
        OpenLibraryMessage.handle(ipcMain, payload => this.handleOpen(payload));
        CloseLibraryMessage.handle(ipcMain, payload => this.handleClose(payload));
        GetLibraryMetadataMessage.handle(ipcMain, payload => this.handleGetMetadata(payload));

    }

    private async handleGetLastOpened(payload: GetLastOpenedLibrariesMessage.RequestPayload): Promise<GetLastOpenedLibrariesMessage.ResponsePayload | ErrorResponse> {
        return this.appService.getLibrariesLastOpened()
            .then((data: LastOpenedLibraryEntry[]) => ({ lastOpened: data }))
            .catch(err => errorResponse(err));
    }

    private async handleCreate(payload: CreateLibraryMessage.RequestPayload): Promise<CreateLibraryMessage.ResponsePayload | ErrorResponse> {
        return this.appService.createLibrary(payload.targetDir, payload.name)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return {};
            })
            .catch(err => errorResponse(err));
    }

    private async handleOpen(payload: OpenLibraryMessage.RequestPayload): Promise<OpenLibraryMessage.ResponsePayload | ErrorResponse> {
        return this.appService.openLibrary(payload.path)
            .then(() => {
                this.windowService.switchToLargeWindow();
                return {};
            })
            .catch(err => errorResponse(err));
    }

    private async handleClose(payload: CloseLibraryMessage.RequestPayload): Promise<CloseLibraryMessage.ResponsePayload | ErrorResponse> {
        this.windowService.switchToSmallWindow();
        this.appService.closeCurrentLibrary();
        return {};
    }

    private async handleGetMetadata(payload: GetLibraryMetadataMessage.RequestPayload): Promise<GetLibraryMetadataMessage.ResponsePayload | ErrorResponse> {
        return this.appService.getLibraryMetadata()
            .then((data: LibraryMetadata) => ({ data: data }))
            .catch(err => errorResponse(err));
    }

}