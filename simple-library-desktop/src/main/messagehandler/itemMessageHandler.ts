import { ItemService } from '../service/ItemService';
import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import {
    DeleteItemsMessage, GetItemMetadataMessage,
    GetItemsMessage,
    ImportItemsMessage,
    OpenItemsExternalMessage
} from '../../common/messaging/messagesItems';
import {ImportResult, ItemData, MetadataEntry} from '../../common/commonModels';

export class ItemMessageHandler {

    itemService: ItemService;

    constructor(itemService: ItemService) {
        this.itemService = itemService;
    }

    public initialize(): void {
        GetItemsMessage.handle(ipcMain, payload => this.handleGet(payload));
        DeleteItemsMessage.handle(ipcMain, payload => this.handleDelete(payload));
        ImportItemsMessage.handle(ipcMain, payload => this.handleImport(payload));
        OpenItemsExternalMessage.handle(ipcMain, payload => this.handleOpenExternal(payload));
        GetItemMetadataMessage.handle(ipcMain, payload => this.handleGetMetadata(payload));
    }

    private async handleGet(payload: GetItemsMessage.RequestPayload): Promise<GetItemsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.getAllItems(payload.collectionId, payload.itemAttributeKeys)
            .then((items: ItemData[]) => ({ items: items }))
            .catch(err => errorResponse(err));
    }

    private async handleDelete(payload: DeleteItemsMessage.RequestPayload): Promise<DeleteItemsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.deleteItems(payload.itemIds)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleImport(payload: ImportItemsMessage.RequestPayload): Promise<ImportItemsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.importFiles(payload.data)
            .then((result: ImportResult) => ({ result: result }))
            .catch(err => errorResponse(err));
    }

    private async handleOpenExternal(payload: OpenItemsExternalMessage.RequestPayload): Promise<OpenItemsExternalMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.openFilesExternal(payload.itemIds)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleGetMetadata(payload: GetItemMetadataMessage.RequestPayload): Promise<GetItemMetadataMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.getItemMetadata(payload.itemId)
            .then((entries: MetadataEntry[]) => ({metadataEntries: entries}))
            .catch(err => errorResponse(err));
    }

}