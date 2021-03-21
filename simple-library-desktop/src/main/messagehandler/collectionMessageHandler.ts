import { CollectionService } from '../service/collection/collectionService';
import { ipcMain } from 'electron';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    GetAllCollectionsMessage, MoveCollectionMessage,
    MoveItemsToCollectionsMessage,
    RenameCollectionMessage,
} from '../../common/messaging/messagesCollections';
import { Collection } from '../../common/commonModels';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';

export class CollectionMessageHandler {

    collectionService: CollectionService;

    constructor(collectionService: CollectionService) {
        this.collectionService = collectionService;
    }

    public initialize(): void {
        GetAllCollectionsMessage.handle(ipcMain, payload => this.handleGetAll(payload));
        CreateCollectionMessage.handle(ipcMain, payload => this.handleCreate(payload));
        DeleteCollectionMessage.handle(ipcMain, payload => this.handleDelete(payload));
        RenameCollectionMessage.handle(ipcMain, payload => this.handleRename(payload));
        MoveCollectionMessage.handle(ipcMain, payload => this.handleMove(payload));
        MoveItemsToCollectionsMessage.handle(ipcMain, payload => this.handleMoveItems(payload));
    }

    private async handleGetAll(payload: GetAllCollectionsMessage.RequestPayload): Promise<GetAllCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.getAllCollections(payload.includeItemCount)
            .then((collections: Collection[]) => ({ collections: collections }))
            .catch(err => errorResponse(err));
    }

    private async handleCreate(payload: CreateCollectionMessage.RequestPayload): Promise<CreateCollectionMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.createCollection(payload.name, payload.parentGroupId)
            .then((collection: Collection) => ({ collection: collection }))
            .catch(err => errorResponse(err));
    }

    private async handleDelete(payload: DeleteCollectionMessage.RequestPayload): Promise<DeleteCollectionMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.deleteCollection(payload.collectionId)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleRename(payload: RenameCollectionMessage.RequestPayload): Promise<RenameCollectionMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.renameCollection(payload.collectionId, payload.newName)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleMove(payload: MoveCollectionMessage.RequestPayload): Promise<MoveCollectionMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.moveCollection(payload.collectionId, payload.targetGroupId)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleMoveItems(payload: MoveItemsToCollectionsMessage.RequestPayload): Promise<MoveItemsToCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.moveItemsToCollection(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

}
