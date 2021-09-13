import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite,
	IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite,
	useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {genNotificationId, toNotificationEntry} from "../hooks/base/notificationUtils";
import {NotificationStackEntry} from "../../components/modals/notification/NotificationStack";


// STATE

export interface NotificationState {
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
	GROUP_DELETE_FAILED,
	OPEN_CONFIG_FILE_FAILED,
}

const initialState: NotificationState = {
	notifications: []
};


// REDUCER

export enum NotificationActionType {
	NOTIFICATIONS_ADD = "notifications.add",
	NOTIFICATIONS_REMOVE = "notifications.remove",
	NOTIFICATIONS_UPDATE = "notifications.update",
}

const reducerConfigMap: ReducerConfigMap<NotificationActionType, NotificationState> = new ReducerConfigMap([
	[NotificationActionType.NOTIFICATIONS_ADD, (state, payload) => ({
		...state,
		notifications: [...state.notifications, {
			id: payload.notificationId,
			type: payload.notificationType,
			data: payload.notificationData
		}]
	})],
	[NotificationActionType.NOTIFICATIONS_REMOVE, (state, payload) => ({
		...state,
		notifications: state.notifications.filter((notification: AppNotification) => notification.id !== payload.notificationId)
	})],
	[NotificationActionType.NOTIFICATIONS_UPDATE, (state, payload) => ({
		...state,
		notifications: state.notifications.map((notification: AppNotification) => {
			if (notification.id === payload.notificationId) {
				return {
					id: notification.id,
					type: notification.type,
					data: payload.notificationData
				};
			} else {
				return notification;
			}
		})
	})]
]);


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<NotificationActionType, NotificationState>();

export function NotificationStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useNotificationContext(): IStateHookResultReadWrite<NotificationState, NotificationActionType> {
	return useGlobalStateReadWrite<NotificationState, NotificationActionType>(stateContext, dispatchContext);
}

function useNotificationDispatch(): IStateHookResultWriteOnly<NotificationActionType> {
	return useGlobalStateWriteOnly<NotificationActionType>(dispatchContext);
}

export function useDispatchAddNotification(): (notificationId: string, type: AppNotificationType, data: any) => void {
	const dispatch = useNotificationDispatch();
	return (notificationId: string, type: AppNotificationType, data: any) => {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_ADD,
			payload: {
				notificationId: notificationId ? notificationId : genNotificationId(),
				notificationType: type,
				notificationData: data,
			},
		});
	}
}

export function useDispatchRemoveNotification(): (notificationId: string) => void {
	const dispatch = useNotificationDispatch();
	return (notificationId: string) => {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_REMOVE,
			payload: {
				notificationId: notificationId,
			},
		});
	}
}

export function useDispatchUpdateNotification(): (notificationId: string, data: any) => void {
	const dispatch = useNotificationDispatch();
	return (notificationId: string, data: any) => {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_UPDATE,
			payload: {
				notificationId: notificationId,
				notificationData: data,
			},
		});
	}
}

export function useThrowErrorWithNotification() {
	const dispatchAdd = useDispatchAddNotification();

	function throwError(notificationId: string, type: AppNotificationType, error: any) {
		dispatchAdd(notificationId, type, error);
		throw error
	}

	return throwError;
}

export function useGetNotificationStackEntries() {
	const [state] = useNotificationContext();
	const dispatchRemove = useDispatchRemoveNotification();
	function getNotificationStackEntries() {
		return state.notifications
			.map(notification => toNotificationEntry(notification, () => dispatchRemove(notification.id)))
	}
	return getNotificationStackEntries;
}

