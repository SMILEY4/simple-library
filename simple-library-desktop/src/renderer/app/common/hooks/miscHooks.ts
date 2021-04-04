import { Dispatch, MutableRefObject, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { GlobalStateContext } from '../../store/provider';
import { AppNotificationType } from '../../store/state';
import { ActionType } from '../../store/reducer';
import { genNotificationId } from '../utils/notificationUtils';
import { ImportProcessData, ImportResult, ImportStatus } from '../../../../common/commonModels';
import { onImportStatusCommands, requestImport } from '../messaging/messagingInterface';
import { useGroups } from './groupHooks';
import { useItems } from './itemHooks';


export function useGlobalState() {
    const { state, dispatch } = useContext(GlobalStateContext);
    if (state) {
        return { state, dispatch };
    } else {
        console.error("Error: No global state found.");
    }
}


export function useStateRef<S>(initialValue: S): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
    const [value, setValue] = useState(initialValue);

    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}


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


export function useImport() {

    const [showDialog, setShowDialog] = useState(false);
    const { addNotification, updateNotification, removeNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();
    const { reloadItems } = useItems();

    const startImportProcess = (data: ImportProcessData) => {
        setShowDialog(false);

        const importStatusNotificationId = genNotificationId();
        addNotification(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);
        onImportStatusCommands((status: ImportStatus) => updateNotification(importStatusNotificationId, status));

        requestImport(data,
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result),
        )
            .catch(error => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
            .then(() => reloadRootGroup())
            .then(() => reloadItems())
            .finally(() => removeNotification(importStatusNotificationId));
    };

    return {
        showImportDialog: showDialog,
        openImportDialog: () => setShowDialog(true),
        closeImportDialog: () => setShowDialog(false),
        startImportProcess: startImportProcess,
    };

}


export function useDialogHook() {

    const [showDialog, setShowDialog] = useState(false);

    const open = () => {
        setShowDialog(true);
    };

    const close = () => {
        setShowDialog(false);
    };

    const accept = () => {
        close();
    };

    return {
        showDialog: showDialog,
        openDialog: open,
        closeDialog: close,
        acceptDialog: accept,
    };

}