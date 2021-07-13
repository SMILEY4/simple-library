import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper} from "./core/msgUtils";
import {Collection, CollectionType} from "../commonModels";

export module CollectionMsgConstants {
	export const PREFIX: string = "collection";
	export const GET_ALL: string = "get-all";
	export const CREATE: string = "create";
	export const DELETE: string = "delete";
	export const EDIT: string = "edit";
	export const MOVE: string = "move";
	export const MOVE_ITEMS_TO: string = "move-items";
	export const REMOVE_ITEMS_FROM: string = "remove-items";
}


export abstract class AbstractCollectionMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(CollectionMsgConstants.PREFIX, ipcWrapper);
		this.register(CollectionMsgConstants.GET_ALL, (payload: any) => this.getAll(payload.includeItemCount));
		this.register(CollectionMsgConstants.CREATE, (payload: any) => this.createCollection(payload.name, payload.type, payload.parentGroupId, payload.smartQuery));
		this.register(CollectionMsgConstants.DELETE, (payload: any) => this.deleteCollection(payload.collectionId));
		this.register(CollectionMsgConstants.EDIT, (payload: any) => this.editCollection(payload.collectionId, payload.newName, payload.newSmartQuery));
		this.register(CollectionMsgConstants.MOVE, (payload: any) => this.moveCollection(payload.collectionId, payload.targetGroupId));
		this.register(CollectionMsgConstants.MOVE_ITEMS_TO, (payload: any) => this.moveItemsToCollection(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy));
		this.register(CollectionMsgConstants.REMOVE_ITEMS_FROM, (payload: any) => this.removeItemsFromCollection(payload.collectionId, payload.itemIds));
	}

	protected abstract getAll(includeItemCount: boolean): Promise<Collection[]>;

	protected abstract createCollection(
		name: string,
		type: CollectionType,
		parentGroupId: number | null,
		smartQuery: string | null
	): Promise<Collection>;

	protected abstract deleteCollection(collectionId: number): Promise<void>;

	protected abstract editCollection(
		collectionId: number,
		newName: string,
		newSmartQuery: string
	): Promise<void>;

	protected abstract moveCollection(
		collectionId: number,
		targetGroupId: number | null
	): Promise<void>;

	protected abstract moveItemsToCollection(
		sourceCollectionId: number,
		targetCollectionId: number,
		itemIds: number[],
		copy: boolean
	): Promise<void>;

	protected abstract removeItemsFromCollection(
		collectionId: number,
		itemIds: number[]
	): Promise<void>;

}

