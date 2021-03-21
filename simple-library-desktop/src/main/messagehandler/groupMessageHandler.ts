import { ipcMain } from 'electron';
import { errorResponse, ErrorResponse } from '../../common/messaging/messages';
import { Group } from '../../common/commonModels';
import {
    CreateGroupMessage,
    DeleteGroupMessage,
    GetGroupsMessage, MoveGroupMessage,
    RenameGroupMessage,
} from '../../common/messaging/messagesGroups';
import { GroupService } from '../service/group/groupService';

export class GroupMessageHandler {

    groupService: GroupService;

    constructor(groupService: GroupService) {
        this.groupService = groupService;
    }

    public initialize(): void {
        GetGroupsMessage.handle(ipcMain, payload => this.handleGet(payload));
        CreateGroupMessage.handle(ipcMain, payload => this.handleCreate(payload));
        DeleteGroupMessage.handle(ipcMain, payload => this.handleDelete(payload));
        RenameGroupMessage.handle(ipcMain, payload => this.handleRename(payload));
        MoveGroupMessage.handle(ipcMain, payload => this.handleMove(payload));
    }

    private async handleGet(payload: GetGroupsMessage.RequestPayload): Promise<GetGroupsMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.getGroups(payload.includeCollections, payload.includeItemCount)
            .then((groups: Group[]) => ({ groups: groups }))
            .catch(err => errorResponse(err));
    }

    private async handleCreate(payload: CreateGroupMessage.RequestPayload): Promise<CreateGroupMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.createGroup(payload.name, payload.parentGroupId)
            .then((group: Group) => ({ group: group }))
            .catch(err => errorResponse(err));
    }

    private async handleDelete(payload: DeleteGroupMessage.RequestPayload): Promise<DeleteGroupMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.deleteGroup(payload.groupId, payload.deleteChildren)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleRename(payload: RenameGroupMessage.RequestPayload): Promise<RenameGroupMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.renameGroup(payload.groupId, payload.newName)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

    private async handleMove(payload: MoveGroupMessage.RequestPayload): Promise<MoveGroupMessage.ResponsePayload | ErrorResponse> {
        return this.groupService.moveGroup(payload.groupId, payload.targetGroupId)
            .then(() => ({}))
            .catch(err => errorResponse(err));
    }

}