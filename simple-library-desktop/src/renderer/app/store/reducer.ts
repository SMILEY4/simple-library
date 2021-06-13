import {AppNotification, GlobalApplicationState} from './state';
import {unique} from '../common/arrayUtils';

export enum ActionType {
    SET_CURRENT_COLLECTION_ID = "collection.set",
    SET_ITEMS = "items.set",
    SET_ROOT_GROUP = "rootgroup.set",

    NOTIFICATIONS_ADD = "notifications.add",
    NOTIFICATIONS_REMOVE = "notifications.remove",
    NOTIFICATIONS_UPDATE = "notifications.update",

    ITEM_SELECTION_SET = "items.selection.set",
    ITEM_SELECTION_ADD = "items.selection.add",
    ITEM_SELECTION_REMOVE = "items.selection.remove",
    ITEM_SELECTION_SET_LAST = "item.selection.set-last",

    COLLECTION_SIDEBAR_SET_EXPANDED = "ui.sidebar.collections.expanded.set"

}

export type Action = {
    type: ActionType
    payload: any
}

export function Reducer(state: GlobalApplicationState, action: Action): GlobalApplicationState {
    switch (action.type) {

        // MISC

        case ActionType.SET_CURRENT_COLLECTION_ID: {
            return {
                ...state,
                activeCollectionId: action.payload,
            };
        }
        case ActionType.SET_ITEMS: {
            return {
                ...state,
                items: action.payload,
            };
        }
        case ActionType.SET_ROOT_GROUP: {
            return {
                ...state,
                rootGroup: action.payload,
            };
        }

        // NOTIFICATIONS

        case ActionType.NOTIFICATIONS_ADD: {
            return {
                ...state,
                notifications: [...state.notifications, {
                    id: action.payload.notificationId,
                    type: action.payload.notificationType,
                    data: action.payload.notificationData,
                }],
            };
        }
        case ActionType.NOTIFICATIONS_REMOVE: {
            return {
                ...state,
                notifications: state.notifications
                    .filter((notification: AppNotification) => notification.id !== action.payload.notificationId),
            };
        }
        case ActionType.NOTIFICATIONS_UPDATE: {
            return {
                ...state,
                notifications: state.notifications.map((notification: AppNotification) => {
                    if (notification.id === action.payload.notificationId) {
                        return {
                            id: notification.id,
                            type: notification.type,
                            data: action.payload.notificationData,
                        };
                    } else {
                        return notification;
                    }
                }),
            };
        }

        // COLLECTION SIDEBAR

        case ActionType.COLLECTION_SIDEBAR_SET_EXPANDED: {
            return {
                ...state,
                collectionSidebarExpandedNodes: action.payload,
            };
        }

        // ITEM SELECTION

        case ActionType.ITEM_SELECTION_SET: {
            return {
                ...state,
                selectedItemIds: action.payload,
            };
        }
        case ActionType.ITEM_SELECTION_ADD: {
            return {
                ...state,
                selectedItemIds: unique<number>([...state.selectedItemIds, ...action.payload]),
            };
        }
        case ActionType.ITEM_SELECTION_REMOVE: {
            return {
                ...state,
                selectedItemIds: state.selectedItemIds.filter(itemId => action.payload.indexOf(itemId) === -1),
            };
        }
        case ActionType.ITEM_SELECTION_SET_LAST: {
            return {
                ...state,
                lastSelectedItemId: action.payload,
            };
        }


        // DEFAULT

        default: {
            console.error("Unknown ActionType: '" + action.type + "'");
            return state;
        }
    }
}