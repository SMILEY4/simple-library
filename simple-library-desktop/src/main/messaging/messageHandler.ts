import { failedResponse, Response, successResponse } from './messages';
import { ipcMain } from 'electron';
import { LibraryService } from '../service/library/libraryService';
import { WindowService } from '../windows/windowService';
import {
    Collection,
    ImportProcessData,
    ImportResult,
    ItemData,
    LastOpenedLibraryEntry,
    LibraryMetadata,
} from '../../common/commonModels';
import {
    CloseCurrentLibraryMessage,
    CreateCollectionMessage,
    CreateLibraryMessage, DeleteCollectionMessage,
    GetCollectionsMessage,
    GetItemsMessage,
    GetLastOpenedLibrariesMessage,
    GetLibraryMetadataMessage,
    GetTotalItemCountMessage,
    ImportFilesMessage,
    MoveItemsToCollectionsMessage,
    OpenLibraryMessage, RenameCollectionMessage,
} from './messagesLibrary';
import { ItemService } from '../service/item/ItemService';
import { CollectionService } from '../service/collection/collectionService';

export class MessageHandler {

    appService: LibraryService;
    itemService: ItemService;
    collectionService: CollectionService;
    windowService: WindowService;

    constructor(appService: LibraryService,
                itemService: ItemService,
                collectionService: CollectionService,
                windowService: WindowService) {
        this.appService = appService;
        this.itemService = itemService;
        this.collectionService = collectionService;
        this.windowService = windowService;
    }


    public initialize(): void {
        CreateLibraryMessage.handle(ipcMain, (path, name) => this.handleRequestCreateLibrary(path, name));
        OpenLibraryMessage.handle(ipcMain, (path) => this.handleRequestOpenLibrary(path));
        GetLibraryMetadataMessage.handle(ipcMain, () => this.handleRequestLibraryMetadata());
        GetLastOpenedLibrariesMessage.handle(ipcMain, () => this.handleRequestLastOpened());
        CloseCurrentLibraryMessage.handle(ipcMain, () => this.handleRequestCloseCurrentProject());
        ImportFilesMessage.handle(ipcMain, (data) => this.handleRequestImportFiles(data));
        GetItemsMessage.handle(ipcMain, (collectionId: number | undefined) => this.handleRequestGetItems(collectionId));
        GetCollectionsMessage.handle(ipcMain, (includeItemCount: boolean) => this.handleRequestGetCollections(includeItemCount));
        GetTotalItemCountMessage.handle(ipcMain, () => this.handleRequestTotalItemCount());
        MoveItemsToCollectionsMessage.handle(ipcMain, (sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean) => this.handleMoveItemsToCollection(sourceCollectionId, collectionId, itemIds, copyMode));
        CreateCollectionMessage.handle(ipcMain, (name: string) => this.handleCreateCollection(name));
        DeleteCollectionMessage.handle(ipcMain, (collectionId: number) => this.handleDeleteCollection(collectionId));
        RenameCollectionMessage.handle(ipcMain, (collectionId: number, newCollectionName:string) => this.handleRenameCollection(collectionId, newCollectionName));
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
            .then((result: ImportResult) => successResponse(result))
            .catch(err => failedResponse(err));
    }

    private async handleRequestGetItems(collectionId: number | undefined): Promise<Response> {
        return this.itemService.getAllItems(collectionId)
            .then((items: ItemData[]) => successResponse(items))
            .catch(err => failedResponse(err));
    }

    private async handleRequestGetCollections(includeItemCount: boolean): Promise<Response> {
        return this.collectionService.getAllCollections(includeItemCount)
            .then((collections: Collection[]) => successResponse(collections))
            .catch(err => failedResponse(err));
    }

    private async handleRequestTotalItemCount(): Promise<Response> {
        return this.itemService.getTotalItemCount()
            .then((count: number) => successResponse(count))
            .catch(err => failedResponse(err));
    }


    private async handleMoveItemsToCollection(sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean): Promise<Response> {
        return this.itemService.moveItemsToCollection(sourceCollectionId, collectionId, itemIds, copyMode)
            .then(() => successResponse())
            .catch(err => failedResponse(err));
    }

    private async handleCreateCollection(name: string): Promise<Response> {
        return this.collectionService.createCollection(name)
            .then((collection: Collection) => successResponse(collection))
            .catch(err => failedResponse(err));
    }


    private async handleDeleteCollection(collectionId: number): Promise<Response> {
        return this.collectionService.deleteCollection(collectionId)
            .then(() => successResponse())
            .catch(err => failedResponse(err));
    }

    private async handleRenameCollection(collectionId: number, newCollectionName:string): Promise<Response> {
        return this.collectionService.renameCollection(collectionId, newCollectionName)
            .then(() => successResponse())
            .catch(err => failedResponse(err));
    }

}