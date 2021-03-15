import { ItemService } from '../service/item/ItemService';
import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import { GetItemCountMessage, GetItemsMessage, ImportItemsMessage } from '../../common/messaging/messagesItems';
import { ImportResult, ItemData } from '../../common/commonModels';

export class ItemMessageHandler {

    itemService: ItemService;

    constructor(itemService: ItemService) {
        this.itemService = itemService;
    }

    public initialize(): void {
        GetItemsMessage.handle(ipcMain, payload => this.handleGet(payload));
        GetItemCountMessage.handle(ipcMain, payload => this.handleCount(payload));
        ImportItemsMessage.handle(ipcMain, payload => this.handleImport(payload));
    }

    private async handleGet(payload: GetItemsMessage.RequestPayload): Promise<GetItemsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.getAllItems(payload.collectionId)
            .then((items: ItemData[]) => ({ items: items }))
            .catch(err => errorResponse(err));
    }

    private async handleCount(payload: GetItemCountMessage.RequestPayload): Promise<GetItemCountMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.getTotalItemCount()
            .then((count: number) => ({ count: count }))
            .catch(err => errorResponse(err));
    }

    private async handleImport(payload: ImportItemsMessage.RequestPayload): Promise<ImportItemsMessage.ResponsePayload | ErrorResponse> {
        return this.itemService.importFiles(payload.data)
            .then((result: ImportResult) => ({ result: result }))
            .catch(err => errorResponse(err));
    }

}