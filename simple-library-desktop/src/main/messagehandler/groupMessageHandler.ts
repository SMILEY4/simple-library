import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import { Group } from '../../common/commonModels';
import { GetGroupsMessage } from '../../common/messaging/messagesGroups';
import { CollectionService } from '../service/collection/collectionService';

export class GroupMessageHandler {

    collectionService: CollectionService;

    constructor(collectionService: CollectionService) {
        this.collectionService = collectionService;
    }

    public initialize(): void {
        GetGroupsMessage.handle(ipcMain, payload => this.handleGet(payload));
    }

    private async handleGet(payload: GetGroupsMessage.RequestPayload): Promise<GetGroupsMessage.ResponsePayload | ErrorResponse> {
        return this.collectionService.getGroups(payload.includeCollections, payload.includeItemCount)
            .then((groups: Group[]) => ({ groups: groups }))
            .catch(err => errorResponse(err));
    }

}