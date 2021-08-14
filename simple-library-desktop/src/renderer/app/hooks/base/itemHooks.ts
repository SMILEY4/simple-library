import {
    addImportStatusListener,
    fetchItemById,
    fetchItems,
    removeImportStatusListener,
    requestDeleteItems,
    requestImport,
    requestMoveItems,
    requestRemoveItems
} from "../../common/messagingInterface";
import {useModifyNotifications} from "./notificationHooks";
import {genNotificationId} from "./notificationUtils";
import {AppNotificationType} from "../../store/notificationState";
import {ItemsActionType, useItemsContext, useItemsDispatch} from "../../store/itemsState";
import {ImportProcessDataDTO, ImportResultDTO, ImportStatusDTO, ItemDTO} from "../../../../common/events/dtoModels";

export function useItemsState() {

    const [
        itemsState
    ] = useItemsContext();

    function getItemsIds(): number[] {
        return itemsState.items.map((item: ItemDTO) => item.id);
    }

    return {
        items: itemsState.items,
        getItemsIds: getItemsIds
    };
}


export function useItems() {

    const {
        throwErrorNotification,
        addNotification,
        updateNotification,
        removeNotification
    } = useModifyNotifications();

    const itemsDispatch = useItemsDispatch();

    const itemAttributeKeys: string[] = ["File.FileName", "File.FileCreateDate", "File.FileSize", "File.FileType", "JFIF.JFIFVersion", "PNG.Gamma"];

    function load(collectionId: number): void {
        fetchItems(collectionId, itemAttributeKeys, true)
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
            .then((items: ItemDTO[]) => itemsDispatch({
                type: ItemsActionType.SET_ITEMS,
                payload: items
            }));
    }

    function clear(): void {
        itemsDispatch({
            type: ItemsActionType.SET_ITEMS,
            payload: []
        });
    }

    function remove(collectionId: number, itemIds: number[]): Promise<void> {
        return requestRemoveItems(collectionId, itemIds)
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error))
            .then(() => load(collectionId));
    }

    function deleteItems(itemIds: number[]): Promise<void> {
        return requestDeleteItems(itemIds)
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error));
    }

    function moveOrCopy(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
        return requestMoveItems(srcCollectionId, tgtCollectionId, itemIds, copy)
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_MOVE_FAILED, error));
    }

    function importItems(data: ImportProcessDataDTO): Promise<void> {
        const importStatusNotificationId = genNotificationId();
        addNotification(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);

        const statusListener = (status: ImportStatusDTO) => updateNotification(importStatusNotificationId, status);
        addImportStatusListener(statusListener);
        return requestImport(
            data,
            (result: ImportResultDTO) => addNotification(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
            (result: ImportResultDTO) => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
            (result: ImportResultDTO) => addNotification(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result)
        )
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
            .then(() => removeNotification(importStatusNotificationId))
            .finally(() => removeImportStatusListener());
    }


    function fetchItem(itemId: number): Promise<ItemDTO | null> {
        return fetchItemById(itemId); // todo: error handling -> notification
    }

    return {
        moveOrCopyItems: moveOrCopy,
        importItems: importItems,
        loadItems: load,
        clearItems: clear,
        removeItems: remove,
        deleteItems: deleteItems,
        fetchItem: fetchItem
    };

}
