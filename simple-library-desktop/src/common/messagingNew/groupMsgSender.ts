import {BrowserWindow} from "electron";
import {AbstractMsgSender} from "./core/abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {GroupMsgConstants} from "./GroupMsgHandler";
import {Group} from "../commonModels";

abstract class AbstractGroupMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(GroupMsgConstants.PREFIX, ipcWrapper);
	}

	public getAll(
		includeCollections: boolean,
		includeItemCount: boolean
	): Promise<Group[]> {
		return this.send(GroupMsgConstants.GET_ALL, {
			includeCollections: includeCollections,
			includeItemCount: includeItemCount
		});
	}

	public createGroup(
		name: string,
		parentGroupId: number | null
	): Promise<Group> {
		return this.send(GroupMsgConstants.CREATE, {
			name: name,
			parentGroupId: parentGroupId
		});
	}

	public deleteGroup(
		groupId: number,
		deleteChildren: boolean
	): Promise<void> {
		return this.send(GroupMsgConstants.DELETE, {
			groupId: groupId,
			deleteChildren: deleteChildren
		});
	}

	public renameGroup(
		groupId: number,
		newName: string
	): Promise<void> {
		return this.send(GroupMsgConstants.RENAME, {
			groupId: groupId,
			newName: newName
		});
	}

	public moveGroup(
		groupId: number,
		targetGroupId: number | null
	): Promise<void> {
		return this.send(GroupMsgConstants.MOVE, {
			groupId: groupId,
			targetGroupId: targetGroupId
		});
	}

}


export class MainGroupMsgSender extends AbstractGroupMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}


export class RenderGroupMsgSender extends AbstractGroupMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
