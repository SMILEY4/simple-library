import {useGlobalState} from "./old/miscAppHooks";
import {fetchItems} from "../common/messaging/messagingInterface";
import {useNotifications} from "./notificationHooks";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {ItemData} from "../../../common/commonModels";
import {ActionType} from "../store/reducer";

export function useItems() {

	const {state, dispatch} = useGlobalState();
	const {addNotification} = useNotifications()

	function load(collectionId: number): void {
		fetchItems(collectionId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemData[]) => dispatch({
				type: ActionType.SET_ITEMS,
				payload: items,
			}));
	}

	function clear(): void {
		dispatch({
			type: ActionType.SET_ITEMS,
			payload: [],
		})
	}

	function importItems(): void {
		// todo
		console.log("NOT IMPLEMENTED: import items")
	}

	return {
		items: state.items,
		loadItems: load,
		clearItems: clear,
		importItems: importItems
	}
}


export function useItemSelection() {

	const {state, dispatch} = useGlobalState();

	function isSelected(itemId: number): boolean {
		return state.selectedItemIds.indexOf(itemId) !== -1;
	}

	function setSelection(itemIds: number[]) {
		dispatch({
			type: ActionType.ITEM_SELECTION_SET,
			payload: itemIds,
		});
		dispatch({
			type: ActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function addToSelection(itemIds: number[]) {
		dispatch({
			type: ActionType.ITEM_SELECTION_ADD,
			payload: itemIds,
		});
		dispatch({
			type: ActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function removeFromSelection(itemIds: number[]) {
		dispatch({
			type: ActionType.ITEM_SELECTION_REMOVE,
			payload: itemIds,
		});
		dispatch({
			type: ActionType.ITEM_SELECTION_SET_LAST,
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
			type: ActionType.ITEM_SELECTION_SET_LAST,
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
						type: ActionType.ITEM_SELECTION_ADD,
						payload: idsInRange,
					});
				} else {
					dispatch({
						type: ActionType.ITEM_SELECTION_SET,
						payload: idsInRange,
					});
				}
			}
		} else {
			if (additive) {
				if (state.selectedItemIds.indexOf(itemId) === -1) {
					dispatch({
						type: ActionType.ITEM_SELECTION_ADD,
						payload: [itemId],
					});
				} else {
					dispatch({
						type: ActionType.ITEM_SELECTION_REMOVE,
						payload: [itemId],
					});
				}
			} else {
				dispatch({
					type: ActionType.ITEM_SELECTION_SET,
					payload: [itemId],
				});
			}
		}
		dispatch({
			type: ActionType.ITEM_SELECTION_SET_LAST,
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