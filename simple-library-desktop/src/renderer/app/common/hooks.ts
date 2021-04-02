import { useGlobalState } from '../store/provider';
import { ActionType } from '../store/reducer';
import { Group, ImportProcessData, ImportResult, ImportStatus, ItemData } from '../../../common/commonModels';
import { genNotificationId } from './notificationUtils';
import { AppNotificationType } from '../store/state';
import { useState } from 'react';
import {
    fetchItems,
    fetchRootGroup,
    onImportStatusCommands,
    requestImport,
    requestMoveItems,
    requestRemoveItems,
} from './messagingInterface';

export function useNotifications() {

    const { state, dispatch } = useGlobalState();

    const add = (notificationId: string, type: AppNotificationType, data: any) => {
        dispatch({
            type: ActionType.NOTIFICATIONS_ADD,
            payload: {
                notificationId: notificationId ? notificationId : genNotificationId(),
                notificationType: type,
                notificationData: data,
            },
        });
    };

    const remove = (notificationId: string) => {
        dispatch({
            type: ActionType.NOTIFICATIONS_REMOVE,
            payload: {
                notificationId: notificationId,
            },
        });
    };

    const update = (notificationId: string, data: any) => {
        dispatch({
            type: ActionType.NOTIFICATIONS_UPDATE,
            payload: {
                notificationId: notificationId,
                notificationData: data,
            },
        });
    };

    return {
        notifications: state.notifications,
        addNotification: add,
        removeNotification: remove,
        updateNotification: update,
    };
}


export function useRootGroup() {

    const { state, dispatch } = useGlobalState();

    const setRootGroup = (group: Group) => {
        dispatch({
            type: ActionType.SET_ROOT_GROUP,
            payload: group,
        });
    };

    return {
        rootGroup: state.rootGroup,
        setRootGroup: setRootGroup,
    };
}


export function useActiveCollection() {

    const { state, dispatch } = useGlobalState();
    const { addNotification } = useNotifications();

    const setActive = (collectionId: number | null) => {
        dispatch({
            type: ActionType.SET_CURRENT_COLLECTION_ID,
            payload: collectionId,
        });
        if (collectionId) {
            fetchItems(collectionId)
                .then((items: ItemData[]) => {
                    dispatch({
                        type: ActionType.SET_ITEMS,
                        payload: items,
                    });
                })
                .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error));
        } else {
            dispatch({
                type: ActionType.SET_ITEMS,
                payload: [],
            });
        }
    };

    return {
        activeCollectionId: state.activeCollectionId,
        setActiveCollection: setActive,
    };
}


export function useItems() {
    const { state, dispatch } = useGlobalState();
    const { setRootGroup } = useRootGroup();
    const { activeCollectionId } = useActiveCollection();
    const { addNotification } = useNotifications();

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
                .then(() => fetchRootGroup())
                .catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
                .then((rootGroup: Group) => setRootGroup(rootGroup))
                .then(() => fetchItems(activeCollectionId))
                .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
                .then((items: ItemData[]) => dispatch({
                    type: ActionType.SET_ITEMS,
                    payload: items,
                }));
        }
    };

    const removeItems = (itemIds: number[], srcCollectionId: number) => {
        requestRemoveItems(srcCollectionId, itemIds)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error))
            .then(() => fetchRootGroup())
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
            .then((rootGroup: Group) => setRootGroup(rootGroup))
            .then(() => fetchItems(activeCollectionId))
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
            .then((items: ItemData[]) => dispatch({
                type: ActionType.SET_ITEMS,
                payload: items,
            }));
    };

    return {
        items: state.items,
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


export function useImport() {

    const [showImportDialog, setShowImportDialog] = useState(false);
    const { addNotification, updateNotification, removeNotification } = useNotifications();

    const startImportProcess = (data: ImportProcessData) => {
        setShowImportDialog(false);

        const importStatusNotificationId = genNotificationId();
        addNotification(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);
        onImportStatusCommands((status: ImportStatus) => updateNotification(importStatusNotificationId, status));

        requestImport(data,
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result),
        )
            .catch(error => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
            .finally(() => removeNotification(importStatusNotificationId));
    };

    return {
        showImportDialog: showImportDialog,
        openImportDialog: () => setShowImportDialog(true),
        closeImportDialog: () => setShowImportDialog(false),
        startImportProcess: startImportProcess,
    };

}


export function useCreateCollection() {
    // todo

    const open = (parentGroupId?:number) => {

    };

    const close = () => {

    };

    const create = () => {

    };

    return {
        showCreateCollectionDialog: false,
        openCreateCollectionDialog: open,
        closeCreateCollectionDialog: close,
        createCollection: create,
    };

}


export function useCreateGroup() {
    // todo

    const open = (parentGroupId?:number) => {

    };

    const close = () => {

    };

    const create = () => {

    };

    return {
        showCreateGroupDialog: false,
        openCreateGroupDialog: open,
        closeCreateGroupDialog: close,
        createGroup: create,
    };

}
