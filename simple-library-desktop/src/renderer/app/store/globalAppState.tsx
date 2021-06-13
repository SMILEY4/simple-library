import {
	applyStateAction,
	buildAsyncer,
	buildGlobalStateContext,
	GenericGlobalStateContext,
	GenericStateAction,
	useGenericGlobalStateProvider
} from "./storeUtils";
import React, {Context} from "react";
import {Group, ItemData} from "../../../common/commonModels";
import {unique} from "../common/arrayUtils";


// STATE

export interface GlobalApplicationState {
	notifications: AppNotification[]
	collectionSidebarExpandedNodes: string[]

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
	OPEN_LIBRARY_FAILED,
	CREATE_LIBRARY_FAILED,
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

export const initialGlobalAppState: GlobalApplicationState = {
	notifications: [],
	collectionSidebarExpandedNodes: [],
	rootGroup: null,
	activeCollectionId: null,

	items: [],
	selectedItemIds: [],
	lastSelectedItemId: null,
};


// REDUCER

export enum AppActionType {
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

const reducerConfigMap = new Map<AppActionType, (state: GlobalApplicationState, payload: any) => GlobalApplicationState>([

	[AppActionType.SET_CURRENT_COLLECTION_ID, (state, payload) => ({
		...state,
		activeCollectionId: payload,
	})],
	[AppActionType.SET_ITEMS, (state, payload) => ({
		...state,
		items: payload,
	})],
	[AppActionType.SET_ROOT_GROUP, (state, payload) => ({
		...state,
		rootGroup: payload,
	})],


	[AppActionType.NOTIFICATIONS_ADD, (state, payload) => ({
		...state,
		notifications: [...state.notifications, {
			id: payload.notificationId,
			type: payload.notificationType,
			data: payload.notificationData,
		}],
	})],
	[AppActionType.NOTIFICATIONS_REMOVE, (state, payload) => ({
		...state,
		notifications: state.notifications.filter((notification: AppNotification) => notification.id !== payload.notificationId),
	})],
	[AppActionType.NOTIFICATIONS_UPDATE, (state, payload) => ({
		...state,
		notifications: state.notifications.map((notification: AppNotification) => {
			if (notification.id === payload.notificationId) {
				return {
					id: notification.id,
					type: notification.type,
					data: payload.notificationData,
				};
			} else {
				return notification;
			}
		}),
	})],


	[AppActionType.COLLECTION_SIDEBAR_SET_EXPANDED, (state, payload) => ({
		...state,
		collectionSidebarExpandedNodes: payload,
	})],


	[AppActionType.ITEM_SELECTION_SET, (state, payload) => ({
		...state,
		selectedItemIds: payload,
	})],
	[AppActionType.ITEM_SELECTION_ADD, (state, payload) => ({
		...state,
		selectedItemIds: unique<number>([...state.selectedItemIds, ...payload]),
	})],
	[AppActionType.ITEM_SELECTION_REMOVE, (state, payload) => ({
		...state,
		selectedItemIds: state.selectedItemIds.filter(itemId => payload.indexOf(itemId) === -1),
	})],
	[AppActionType.ITEM_SELECTION_SET_LAST, (state, payload) => ({
		...state,
		lastSelectedItemId: payload,
	})],

])

export function AppStateReducer(state: GlobalApplicationState, action: GenericStateAction<AppActionType>): GlobalApplicationState {
	return applyStateAction(reducerConfigMap, action, state)
}

// CONTEXT

const asyncer = buildAsyncer<GlobalApplicationState>()

export const GlobalAppStateContext: Context<GenericGlobalStateContext<GlobalApplicationState>> = buildGlobalStateContext<GlobalApplicationState>()

export function GlobalAppStateProvider(props: { children: any }) {
	const [state, dispatch] = useGenericGlobalStateProvider(initialGlobalAppState, AppStateReducer, asyncer)
	return (
		<GlobalAppStateContext.Provider value={{state, dispatch}}>
			{props.children}
		</GlobalAppStateContext.Provider>
	);
}