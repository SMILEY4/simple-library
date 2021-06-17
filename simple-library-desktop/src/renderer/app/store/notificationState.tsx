import {buildGlobalStateContext, GenericGlobalStateContext, genericStateProvider, ReducerConfigMap} from "./storeUtils";
import React, {Context, useContext} from "react";


export interface GlobalNotificationState {
	notifications: AppNotification[]
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

const initialState: GlobalNotificationState = {
	notifications: [],
};


export enum NotificationActionType {
	NOTIFICATIONS_ADD = "notifications.add",
	NOTIFICATIONS_REMOVE = "notifications.remove",
	NOTIFICATIONS_UPDATE = "notifications.update",
}

const reducerConfigMap: ReducerConfigMap<NotificationActionType, GlobalNotificationState> = new ReducerConfigMap([
	[NotificationActionType.NOTIFICATIONS_ADD, (state, payload) => ({
		...state,
		notifications: [...state.notifications, {
			id: payload.notificationId,
			type: payload.notificationType,
			data: payload.notificationData,
		}],
	})],
	[NotificationActionType.NOTIFICATIONS_REMOVE, (state, payload) => ({
		...state,
		notifications: state.notifications.filter((notification: AppNotification) => notification.id !== payload.notificationId),
	})],
	[NotificationActionType.NOTIFICATIONS_UPDATE, (state, payload) => ({
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
])

const globalNotificationStateContext: Context<GenericGlobalStateContext<GlobalNotificationState>> = buildGlobalStateContext<GlobalNotificationState>()

export function GlobalNotificationStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, globalNotificationStateContext)
}

export function useNotificationState() {
	const {state, dispatch} = useContext(globalNotificationStateContext);
	if (state) {
		return {state, dispatch};
	} else {
		console.error("Error: No global notification state found.");
	}
}

