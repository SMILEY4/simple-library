import { useActiveCollection } from './collectionHooks';
import { useGlobalState, useNotifications } from './miscHooks';
import { fetchItems, requestMoveItems, requestRemoveItems } from '../messaging/messagingInterface';
import { genNotificationId } from '../utils/notificationUtils';
import { AppNotificationType } from '../../store/state';
import { ItemData } from '../../../common/commonModels';
import { ActionType } from '../../store/reducer';
import { useRootGroup } from './groupHooks';


export function useItems() {
    const { state, dispatch } = useGlobalState();
    const { reloadRootGroup } = useRootGroup();
    const { activeCollectionId } = useActiveCollection();
    const { addNotification } = useNotifications();

    const setItems = (collectionId: number) => {
        fetchItems(collectionId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
            .then((items: ItemData[]) => dispatch({
                type: ActionType.SET_ITEMS,
                payload: items,
            }));
    };

    const reloadItems = () => {
        setItems(activeCollectionId);
    };

    const moveItems = (itemIds: number[], srcCollectionId: number, tgtCollectionId: number) => {
        copyOrMoveItems(itemIds, srcCollectionId, tgtCollectionId, false);
    };

    const copyItems = (itemIds: number[], srcCollectionId: number, tgtCollectionId: number) => {
        copyOrMoveItems(itemIds, srcCollectionId, tgtCollectionId, true);
    };

    const copyOrMoveItems = (itemIds: number[], srcCollectionId: number, tgtCollectionId: number, copy: boolean) => {
        if (srcCollectionId !== tgtCollectionId) {
            requestMoveItems(srcCollectionId, tgtCollectionId, itemIds, copy)
                .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_MOVE_FAILED, error))
                .then(() => reloadRootGroup())
                .then(() => reloadItems());
        }
    };

    const removeItems = (itemIds: number[], srcCollectionId: number) => {
        requestRemoveItems(srcCollectionId, itemIds)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => reloadItems());
    };


    return {
        items: state.items,
        reloadItems: reloadItems,
        setItems: setItems,
        moveItems: moveItems,
        copyItems: copyItems,
        removeItems: removeItems,
    };
}


export function useItemSelection() {
    const { state, dispatch } = useGlobalState();

    const isSelected = (itemId: number): boolean => {
        return state.selectedItemIds.indexOf(itemId) !== -1;
    };

    const setSelection = (itemIds: number[]) => {
        dispatch({
            type: ActionType.ITEM_SELECTION_SET,
            payload: itemIds,
        });
        dispatch({
            type: ActionType.ITEM_SELECTION_SET_LAST,
            payload: itemIds.length > 0 ? itemIds[0] : null,
        });
    };

    const addToSelection = (itemIds: number[]) => {
        dispatch({
            type: ActionType.ITEM_SELECTION_ADD,
            payload: itemIds,
        });
        dispatch({
            type: ActionType.ITEM_SELECTION_SET_LAST,
            payload: itemIds.length > 0 ? itemIds[0] : null,
        });
    };

    const removeFromSelection = (itemIds: number[]) => {
        dispatch({
            type: ActionType.ITEM_SELECTION_REMOVE,
            payload: itemIds,
        });
        dispatch({
            type: ActionType.ITEM_SELECTION_SET_LAST,
            payload: itemIds.length > 0 ? itemIds[0] : null,
        });
    };

    const toggleSelection = (itemIds: number[]) => {
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
    };

    const selectRangeTo = (itemId: number, additive: boolean) => {
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
    };

    const selectAll = () => {
        setSelection(state.items.map((item: ItemData) => item.id));
    };

    const clearSelection = () => {
        setSelection([]);
    };

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



