import {BrowserWindow} from "electron";
import {AbstractMsgSender} from "./core/abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {CollectionMsgConstants} from "./collectionMsgHandler";
import {Collection, CollectionType} from "../commonModels";

abstract class AbstractCollectionMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(CollectionMsgConstants.PREFIX, ipcWrapper);
	}

	public getAll(includeItemCount: boolean): Promise<Collection[]> {
		return this.send(CollectionMsgConstants.GET_ALL, {
			includeItemCount: includeItemCount
		});
	}

	public createCollection(
		name: string,
		type: CollectionType,
		parentGroupId: number | null,
		smartQuery: string | null
	): Promise<Collection> {
		return this.send(CollectionMsgConstants.CREATE, {
			name: name,
			type: type,
			parentGroupId: parentGroupId,
			smartQuery: smartQuery
		});
	}

	public deleteCollection(collectionId: number): Promise<void> {
		return this.send(CollectionMsgConstants.DELETE, {
			collectionId: collectionId
		});
	}

	public editCollection(
		collectionId: number,
		newName: string,
		newSmartQuery: string
	): Promise<void> {
		return this.send(CollectionMsgConstants.EDIT, {
			collectionId: collectionId,
			newName: newName,
			newSmartQuery: newSmartQuery
		});
	}

	public moveCollection(
		collectionId: number,
		targetGroupId: number | null
	): Promise<void> {
		return this.send(CollectionMsgConstants.MOVE, {
			collectionId: collectionId,
			targetGroupId: targetGroupId
		});
	}

	public moveItemsToCollection(
		sourceCollectionId: number,
		targetCollectionId: number,
		itemIds: number[],
		copy: boolean
	): Promise<void> {
		return this.send(CollectionMsgConstants.MOVE_ITEMS_TO, {
			sourceCollectionId: sourceCollectionId,
			targetCollectionId: targetCollectionId,
			itemIds: itemIds,
			copy: copy
		});
	}

	public removeItemsFromCollection(
		collectionId: number,
		itemIds: number[]
	): Promise<void> {
		return this.send(CollectionMsgConstants.REMOVE_ITEMS_FROM, {
			collectionId: collectionId,
			itemIds: itemIds
		});
	}

}


export class MainCollectionMsgSender extends AbstractCollectionMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}


export class RenderCollectionMsgSender extends AbstractCollectionMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
