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
    IMPORT_STATUS

}


export const initialState: GlobalApplicationState = {
    notifications: [],
    rootGroup: null,
    activeCollectionId: null,

    items: [],
    selectedItemIds: [],
    lastSelectedItemId: null,
};




