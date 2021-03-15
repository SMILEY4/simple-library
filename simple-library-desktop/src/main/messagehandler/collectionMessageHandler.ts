import { ItemService } from '../service/item/ItemService';
import { CollectionService } from '../service/collection/collectionService';
import { ipcMain } from 'electron';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    GetAllCollectionsMessage,
    MoveItemsToCollectionsMessage,
    RenameCollectionMessage,
} from '../../common/messaging/messagesCollections';
import { Collection } from '../../common/commonModels';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';

export class CollectionMessageHandler {

    itemService: ItemService;
    collectionService: CollectionService;

    constructor(itemService: ItemService,
                collectionService: CollectionService) {
        this.itemService = itemService;
        this.collectionService = collectionService;
    }

    public initialize(): void {
        GetAllCollectionsMessage.handle(ipcMain, payload => this.handleGetAll(payload));
        CreateCollectionMessage.handle(ipcMain, payload => this.handleCreate(payload));
        DeleteCollectionMessage.handle(ipcMain, payload => this.handleDelete(payload));
        RenameCollectionMessage.handle(ipcMain, payload => this.handleRename(payload));
        MoveItemsToCollectionsMessage.handle(ipcMain, payload => this.handleMoveItems(payload));
    }

    private async handleGetAll(payload: GetAllCollectionsMessage.RequestPayload): Promise<GetAllCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.getAllCollections(payload.includeItemCount)
            .then((collections: Collection[]) => ({ collections: collections }))
            .catch(err => errorResponse(err));
    }

    private async handleCreate(payload: CreateCollectionMessage.RequestPayload): Promise<CreateCollectionMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.createCollection(payload.name)
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

    private async handleMoveItems(payload: MoveItemsToCollectionsMessage.RequestPayload): Promise<MoveItemsToCollectionsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.moveItemsToCollection(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

}
