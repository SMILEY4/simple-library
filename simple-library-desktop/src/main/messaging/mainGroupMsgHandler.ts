import {GroupService} from "../service/groupService";
import {mainIpcWrapper} from "../../common/messaging/core/ipcWrapper";
import {
	GroupCreateChannel,
	GroupDeleteChannel,
	GroupMoveChannel,
	GroupRenameChannel,
	GroupsGetAllChannel
} from "../../common/messaging/channels/channels";

export class MainGroupMsgHandler {

	private readonly groupService: GroupService;

	private readonly channelGetAll = new GroupsGetAllChannel(mainIpcWrapper(), "r");
	private readonly channelCreate = new GroupCreateChannel(mainIpcWrapper(), "r");
	private readonly channelDelete = new GroupDeleteChannel(mainIpcWrapper(), "r");
	private readonly channelRename = new GroupRenameChannel(mainIpcWrapper(), "r");
	private readonly channelMove = new GroupMoveChannel(mainIpcWrapper(), "r");


	constructor(groupService: GroupService) {
		this.groupService = groupService;

		this.channelGetAll.on((payload) => {
			return this.groupService.getGroups(payload.includeCollections, payload.includeItemCount);
		});

		this.channelCreate.on((payload) => {
			return this.groupService.createGroup(payload.name, payload.parentGroupId);
		});

		this.channelDelete.on((payload) => {
			return this.groupService.deleteGroup(payload.groupId, payload.deleteChildren);
		});

		this.channelRename.on((payload) => {
			return this.groupService.renameGroup(payload.groupId, payload.newName);
		});

		this.channelMove.on((payload) => {
			return this.groupService.moveGroup(payload.groupId, payload.targetGroupId);
		});

	}

}
