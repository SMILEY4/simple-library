import { Group, ItemData } from '../../../common/commonModels';


export interface GlobalApplicationState {

    notifications: AppNotification[]

    rootGroup: Group | null,
    activeCollectionId: number | null,

    items: ItemData[],
    selectedItemIds: number[],
    lastSelectedItemId: number | null
}

export interface AppNotification {
    id: string,
    type: AppNotificationType,
    data: any
}

export enum AppNotificationType {
    ROOT_GROUP_FETCH_FAILED,
    ITEMS_FETCH_FAILED,
    ITEMS_MOVE_FAILED,
    ITEMS_REMOVE_FAILED,
    IMPORT_FAILED,
    IMPORT_FAILED_UNKNOWN,
    IMPORT_WITH_ERRORS,
    IMPORT_SUCCESSFUL,
    IMPORT_STATUS,
    COLLECTION_CREATE_FAILED,
    COLLECTION_MOVE_FAILED,
    COLLECTION_EDIT_FAILED,
    COLLECTION_DELETE_FAILED,
    GROUP_CREATE_FAILED,
    GROUP_MOVE_FAILED,
    GROUP_RENAME_FAILED,
    GROUP_DELETE_FAILED
}


export const initialState: GlobalApplicationState = {
    notifications: [],
    rootGroup: null,
    activeCollectionId: null,

    items: [],
    selectedItemIds: [],
    lastSelectedItemId: null,
};




