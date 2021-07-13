import {GroupService} from "../service/groupService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {Group} from "../../common/commonModels";
import {AbstractGroupMsgHandler} from "../../common/messaging/groupMsgHandler";

export class MainGroupMsgHandler extends AbstractGroupMsgHandler {

	private readonly groupService: GroupService;

	constructor(groupService: GroupService) {
		super(mainIpcWrapper());
		this.groupService = groupService;
	}

	protected getAll(
		includeCollections: boolean,
		includeItemCount: boolean
	): Promise<Group[]> {
		return this.groupService.getGroups(includeCollections, includeItemCount);
	}

	protected createGroup(
		name: string,
		parentGroupId: number | null
	): Promise<Group> {
		return this.groupService.createGroup(name, parentGroupId);
	}

	protected deleteGroup(
		groupId: number,
		deleteChildren: boolean
	): Promise<void> {
		return this.groupService.deleteGroup(groupId, deleteChildren);
	}

	protected renameGroup(
		groupId: number,
		newName: string
	): Promise<void> {
		return this.groupService.renameGroup(groupId, newName);
	}

	protected moveGroup(
		groupId: number,
		targetGroupId: number | null
	): Promise<void> {
		return this.groupService.moveGroup(groupId, targetGroupId);
	}

}
