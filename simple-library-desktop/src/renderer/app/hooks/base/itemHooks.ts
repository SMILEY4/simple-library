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
import {ItemsActionType, useItemsState, useItemsStateDispatch} from "../../store/itemsState";
import {ItemSelectionActionType, useItemSelectionState} from "../../store/itemSelectionState";

export function useItems() {

	const [
		itemsState
	] = useItemsState();

	function getItemsIds(): number[] {
		return itemsState.items.map((item: ItemData) => item.id);
	}

	return {
		items: itemsState.items,
		getItemsIds: getItemsIds,
	}
}


export function useItemsStateless() {

	const {
		throwErrorNotification,
		addNotification,
		updateNotification,
		removeNotification
	} = useModifyNotifications()

	const itemsDispatch = useItemsStateDispatch();

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


export function useItemSelection() {

	const [itemSelectionState, itemSelectionDispatch] = useItemSelectionState();

	function isSelected(itemId: number): boolean {
		return itemSelectionState.selectedItemIds.indexOf(itemId) !== -1;
	}

	function setSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function addToSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_ADD,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function removeFromSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_REMOVE,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function toggleSelection(itemIds: number[]) {
		const newSelection: number[] = itemSelectionState.selectedItemIds.filter(itemId => itemIds.indexOf(itemId) === -1);
		itemIds.forEach(itemId => {
			if (itemSelectionState.selectedItemIds.indexOf(itemId) === -1) {
				newSelection.push(itemId);
			}
		});
		setSelection(newSelection);
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function selectRangeTo(itemId: number, additive: boolean, allItemIds: number[]) {
		const pivotItemId: number | null = itemSelectionState.lastSelectedItemId;
		if (pivotItemId) {
			const indexTo: number = allItemIds.indexOf(itemId);
			const indexLast: number = allItemIds.indexOf(pivotItemId);

			if (indexTo >= 0 && indexLast >= 0) {
				const indexStart: number = Math.min(indexTo, indexLast);
				const indexEnd: number = Math.max(indexTo, indexLast);
				const idsInRange: number[] = allItemIds.slice(indexStart, indexEnd + 1);
				if (additive) {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_ADD,
						payload: idsInRange,
					});
				} else {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_SET,
						payload: idsInRange,
					});
				}
			}
		} else {
			if (additive) {
				if (itemSelectionState.selectedItemIds.indexOf(itemId) === -1) {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_ADD,
						payload: [itemId],
					});
				} else {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_REMOVE,
						payload: [itemId],
					});
				}
			} else {
				itemSelectionDispatch({
					type: ItemSelectionActionType.ITEM_SELECTION_SET,
					payload: [itemId],
				});
			}
		}
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: pivotItemId,
		});
	}

	function clearSelection() {
		setSelection([]);
	}

	return {
		selectedItemIds: itemSelectionState.selectedItemIds,
		isSelected: isSelected,
		addToSelection: addToSelection,
		removeFromSelection: removeFromSelection,
		setSelection: setSelection,
		toggleSelection: toggleSelection,
		selectRangeTo: selectRangeTo,
		clearSelection: clearSelection,
	};
}