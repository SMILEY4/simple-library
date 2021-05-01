import { Dispatch, MutableRefObject, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { GlobalStateContext } from '../store/provider';
import { AppNotificationType } from '../store/state';
import { ActionType } from '../store/reducer';
import { genNotificationId } from '../common/utils/notificationUtils';
import { ImportProcessData, ImportResult, ImportStatus } from '../../../common/commonModels';
import { onImportStatusCommands, requestImport } from '../common/messaging/messagingInterface';
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

// TODO: deprecated
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