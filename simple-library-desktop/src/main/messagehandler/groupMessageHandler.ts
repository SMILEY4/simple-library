import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import { Group } from '../../common/commonModels';
import { GetGroupsMessage } from '../../common/messaging/messagesGroups';
import { GroupService } from '../service/group/groupService';

export class GroupMessageHandler {

    groupService: GroupService;

    constructor(groupService: GroupService) {
        this.groupService = groupService;
    }

    public initialize(): void {
        GetGroupsMessage.handle(ipcMain, payload => this.handleGet(payload));
    }

    private async handleGet(payload: GetGroupsMessage.RequestPayload): Promise<GetGroupsMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.getGroups(payload.includeCollections, payload.includeItemCount)
            .then((groups: Group[]) => ({ groups: groups }))
            .catch(err => errorResponse(err));
    }

}