import {
	fetchItems,
	onImportStatusCommands,
	requestImport,
	requestMoveItems,
	requestRemoveItems
} from "../../common/messagingInterface";
import {useModifyNotifications} from "./notificationHooks";
import {genNotificationId} from "./notificationUtils";
import {ImportProcessData, ImportResult, ImportStatus, ItemData} from "../../../../common/commonModels";
import {AppNotificationType} from "../../store/notificationState";
import {ItemsActionType, useItemsContext, useItemsDispatch} from "../../store/itemsState";

export function useItemsState() {

	const [
		itemsState
	] = useItemsContext();

	function getItemsIds(): number[] {
		return itemsState.items.map((item: ItemData) => item.id);
	}

	return {
		items: itemsState.items,
		getItemsIds: getItemsIds,
	}
}


export function useItems() {

	const {
		throwErrorNotification,
		addNotification,
		updateNotification,
		removeNotification
	} = useModifyNotifications()

	const itemsDispatch = useItemsDispatch();

	function load(collectionId: number): void {
		fetchItems(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemData[]) => itemsDispatch({
				type: ItemsActionType.SET_ITEMS,
				payload: items,
			}));
	}

	function clear(): void {
		itemsDispatch({
			type: ItemsActionType.SET_ITEMS,
			payload: [],
		})
	}

	function remove(collectionId: number, itemIds: number[]): Promise<void> {
		return requestRemoveItems(collectionId, itemIds)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error))
			.then(() => load(collectionId))
	}

	function deleteItems(itemIds: number[]): Promise<void> {
		// todo
		console.log("NOT IMPLEMENTED: delete items")
		return new Promise((resolve, reject) => resolve())
	}

	function moveOrCopy(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
		return requestMoveItems(srcCollectionId, tgtCollectionId, itemIds, copy)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_MOVE_FAILED, error))
	}

	function importItems(data: ImportProcessData): Promise<void> {
		const importStatusNotificationId = genNotificationId();
		addNotification(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);
		onImportStatusCommands((status: ImportStatus) => updateNotification(importStatusNotificationId, status));
		return requestImport(
			data,
			(result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
			(result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
			(result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result),
		)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
			.then(() => removeNotification(importStatusNotificationId));
	}

	return {
		moveOrCopyItems: moveOrCopy,
		importItems: importItems,
		loadItems: load,
		clearItems: clear,
		removeItems: remove,
		deleteItems: deleteItems,
	}

}
