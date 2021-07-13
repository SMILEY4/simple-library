import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper, mainIpcWrapper} from "./core/msgUtils";
import {Group} from "../commonModels";
import {GroupService} from "../../main/service/groupService";

export module GroupMsgConstants {
	export const PREFIX: string = "group";
	export const GET_ALL: string = "get-all";
	export const CREATE: string = "create";
	export const DELETE: string = "delete";
	export const RENAME: string = "rename";
	export const MOVE: string = "move";

}

abstract class AbstractGroupMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(GroupMsgConstants.PREFIX, ipcWrapper);
		this.register(GroupMsgConstants.GET_ALL, (payload: any) => this.getAll(payload.includeCollections, payload.includeItemCount));
		this.register(GroupMsgConstants.CREATE, (payload: any) => this.createGroup(payload.name, payload.parentGroupId));
		this.register(GroupMsgConstants.DELETE, (payload: any) => this.deleteGroup(payload.groupId, payload.deleteChildren));
		this.register(GroupMsgConstants.RENAME, (payload: any) => this.renameGroup(payload.groupId, payload.newName));
		this.register(GroupMsgConstants.MOVE, (payload: any) => this.moveGroup(payload.groupId, payload.targetGroupId));
	}

	protected abstract getAll(
		includeCollections: boolean,
		includeItemCount: boolean
	): Promise<Group[]>;

	protected abstract createGroup(
		name: string,
		parentGroupId: number | null
	): Promise<Group>;

	protected abstract deleteGroup(
		groupId: number,
		deleteChildren: boolean
	): Promise<void>;

	protected abstract renameGroup(
		groupId: number,
		newName: string
	): Promise<void>;

	protected abstract moveGroup(
		groupId: number,
		targetGroupId: number | null
	): Promise<void>;

}


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
