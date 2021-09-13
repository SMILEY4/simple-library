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
import {genNotificationId} from "./notificationUtils";
import {
    AppNotificationType,
    useDispatchAddNotification,
    useDispatchRemoveNotification,
    useDispatchUpdateNotification, useThrowErrorWithNotification
} from "../../store/notificationState";
import {
    useDispatchClearItems,
    useDispatchSetItems,
    useDispatchUpdateItemAttribute,
    useItemsContext
} from "../../store/itemsState";
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

    const throwErrorNotification = useThrowErrorWithNotification();
    const notificationAdd = useDispatchAddNotification();
    const notificationUpdate = useDispatchUpdateNotification();
    const notificationRemove = useDispatchRemoveNotification();

    const dispatchSetItems = useDispatchSetItems();
    const dispatchClearItems = useDispatchClearItems();
    const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();

    const itemAttributeKeys: string[] = ["File.FileName", "File.FileCreateDate", "File.FileSize", "File.FileType", "JFIF.JFIFVersion", "PNG.Gamma"];

    function load(collectionId: number): void {
        fetchItems(collectionId, itemAttributeKeys, true)
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
            .then((items: ItemDTO[]) => dispatchSetItems(items));
    }

    function clear(): void {
        dispatchClearItems()
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
        notificationAdd(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);

        const statusListener = (status: ImportStatusDTO) => notificationUpdate(importStatusNotificationId, status);
        addImportStatusListener(statusListener);
        return requestImport(
            data,
            (result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
            (result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
            (result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result)
        )
            .catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
            .then(() => notificationRemove(importStatusNotificationId))
            .finally(() => removeImportStatusListener());
    }


    function fetchItem(itemId: number): Promise<ItemDTO | null> {
        return fetchItemById(itemId); // todo: error handling -> notification
    }

    function updateItemAttributeState(itemId: number, attributeKey: string, newValue: string): void {
        dispatchUpdateItemAttribute(itemId, attributeKey, newValue);
    }

    return {
        moveOrCopyItems: moveOrCopy,
        importItems: importItems,
        loadItems: load,
        clearItems: clear,
        removeItems: remove,
        deleteItems: deleteItems,
        fetchItem: fetchItem,
        updateItemAttributeState: updateItemAttributeState
    };

}
