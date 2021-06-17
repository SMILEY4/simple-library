import {
	fetchItems,
	onImportStatusCommands,
	requestImport,
	requestMoveItems,
	requestRemoveItems
} from "../../common/messagingInterface";
import {useNotifications} from "./notificationHooks";
import {genNotificationId} from "./notificationUtils";
import {ImportProcessData, ImportResult, ImportStatus, ItemData} from "../../../../common/commonModels";
import {AppActionType, useAppState} from "../../store/globalAppState";
import {AppNotificationType} from "../../store/notificationState";

export function useItems() {

	const {state, dispatch} = useAppState();
	const {
		throwErrorNotification,
		addNotification,
		updateNotification,
		removeNotification
	} = useNotifications()

	function load(collectionId: number): void {
		fetchItems(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemData[]) => dispatch({
				type: AppActionType.SET_ITEMS,
				payload: items,
			}));
	}

	function clear(): void {
		dispatch({
			type: AppActionType.SET_ITEMS,
			payload: [],
		})
	}

	function moveOrCopy(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
		return requestMoveItems(srcCollectionId, tgtCollectionId, itemIds, copy)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_MOVE_FAILED, error))
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
		items: state.items,
		loadItems: load,
		clearItems: clear,
		moveOrCopyItems: moveOrCopy,
		removeItems: remove,
		deleteItems: deleteItems,
		importItems: importItems
	}
}


export function useItemSelection() {

	const {state, dispatch} = useAppState();

	function isSelected(itemId: number): boolean {
		return state.selectedItemIds.indexOf(itemId) !== -1;
	}

	function setSelection(itemIds: number[]) {
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET,
			payload: itemIds,
		});
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function addToSelection(itemIds: number[]) {
		dispatch({
			type: AppActionType.ITEM_SELECTION_ADD,
			payload: itemIds,
		});
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function removeFromSelection(itemIds: number[]) {
		dispatch({
			type: AppActionType.ITEM_SELECTION_REMOVE,
			payload: itemIds,
		});
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function toggleSelection(itemIds: number[]) {
		const newSelection: number[] = state.selectedItemIds.filter(itemId => itemIds.indexOf(itemId) === -1);
		itemIds.forEach(itemId => {
			if (state.selectedItemIds.indexOf(itemId) === -1) {
				newSelection.push(itemId);
			}
		});
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
		setSelection(newSelection);
	}

	function selectRangeTo(itemId: number, additive: boolean) {
		const pivotItemId: number | null = state.lastSelectedItemId;
		if (pivotItemId) {
			const allItemIds: number[] = state.items.map((item: ItemData) => item.id);
			const indexTo: number = allItemIds.indexOf(itemId);
			const indexLast: number = allItemIds.indexOf(pivotItemId);

			if (indexTo >= 0 && indexLast >= 0) {
				const indexStart: number = Math.min(indexTo, indexLast);
				const indexEnd: number = Math.max(indexTo, indexLast);
				const idsInRange: number[] = allItemIds.slice(indexStart, indexEnd + 1);
				if (additive) {
					dispatch({
						type: AppActionType.ITEM_SELECTION_ADD,
						payload: idsInRange,
					});
				} else {
					dispatch({
						type: AppActionType.ITEM_SELECTION_SET,
						payload: idsInRange,
					});
				}
			}
		} else {
			if (additive) {
				if (state.selectedItemIds.indexOf(itemId) === -1) {
					dispatch({
						type: AppActionType.ITEM_SELECTION_ADD,
						payload: [itemId],
					});
				} else {
					dispatch({
						type: AppActionType.ITEM_SELECTION_REMOVE,
						payload: [itemId],
					});
				}
			} else {
				dispatch({
					type: AppActionType.ITEM_SELECTION_SET,
					payload: [itemId],
				});
			}
		}
		dispatch({
			type: AppActionType.ITEM_SELECTION_SET_LAST,
			payload: pivotItemId,
		});
	}

	function selectAll() {
		setSelection(state.items.map((item: ItemData) => item.id));
	}

	function clearSelection() {
		setSelection([]);
	}

	return {
		selectedItemIds: state.selectedItemIds,
		isSelected: isSelected,
		addToSelection: addToSelection,
		removeFromSelection: removeFromSelection,
		setSelection: setSelection,
		toggleSelection: toggleSelection,
		selectRangeTo: selectRangeTo,
		selectAll: selectAll,
		clearSelection: clearSelection,
	};
}