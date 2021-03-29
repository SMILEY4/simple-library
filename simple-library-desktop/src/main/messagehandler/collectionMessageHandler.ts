import { CollectionService } from '../service/collectionService';
import { ipcMain } from 'electron';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    GetAllCollectionsMessage,
    MoveCollectionMessage,
    MoveItemsToCollectionsMessage,
    RemoveItemsFromCollectionsMessage,
    RenameCollectionMessage,
} from '../../common/messaging/messagesCollections';
import { Collection, CollectionType } from '../../common/commonModels';
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
        RemoveItemsFromCollectionsMessage.handle(ipcMain, payload => this.handleRemoveItems(payload));
    }

    private async handleGetAll(payload: GetAllCollectionsMessage.RequestPayload): Promise<GetAllCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.getAllCollections(payload.includeItemCount)
            .then((collections: Collection[]) => ({ collections: collections }))
            .catch(err => errorResponse(err));
    }

    private async handleCreate(payload: CreateCollectionMessage.RequestPayload): Promise<CreateCollectionMessage.ResponsePayload | ErrorResponse> {
        let promise: Promise<Collection>;
        if (payload.type === CollectionType.SMART) {
            promise = this.collectionService.createSmartCollection(payload.name, payload.smartQuery, payload.parentGroupId);
        } else {
            promise = this.collectionService.createNormalCollection(payload.name, payload.parentGroupId);
        }
        return promise
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

    private async handleRemoveItems(payload: RemoveItemsFromCollectionsMessage.RequestPayload): Promise<RemoveItemsFromCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.removeItemsFromCollection(payload.collectionId, payload.itemIds)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

}
