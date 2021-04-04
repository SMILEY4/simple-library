import { ActionType } from '../store/reducer';
import { Collection, extractCollections, extractGroups, Group } from '../../../common/commonModels';
import { genNotificationId } from '../common/utils/notificationUtils';
import { AppNotificationType } from '../store/state';
import { useState } from 'react';
import {
    fetchRootGroup,
    requestCreateGroup, requestDeleteGroup,
    requestMoveGroup,
    requestRenameGroup,
} from '../common/messaging/messagingInterface';
import { useDialogHook, useGlobalState, useNotifications, useStateRef } from './miscHooks';


export function useGroups() {

    const { state, dispatch } = useGlobalState();
    const { addNotification } = useNotifications();

    const setRootGroup = (group: Group) => {
        dispatch({
            type: ActionType.SET_ROOT_GROUP,
            payload: group,
        });
    };

    const reloadRootGroup = () => {
        fetchRootGroup()
            .catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
            .then((rootGroup: Group) => setRootGroup(rootGroup));
    };

    const findGroup = (groupId: number | null | undefined): Group | null => {
        const result: Group | undefined = extractGroups(state.rootGroup).find(group => group.id === groupId);
        return result ? result : null;
    };

    const findCollection = (collectionId: number | null | undefined): Collection | null => {
        const result: Collection | undefined = extractCollections(state.rootGroup).find(collection => collection.id === collectionId);
        return result ? result : null;
    };

    const moveGroup = (groupId: number, targetGroupId: number | null) => {
        requestMoveGroup(groupId, targetGroupId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_MOVE_FAILED, error))
            .then(() => reloadRootGroup());
    };

    return {
        rootGroup: state.rootGroup,
        reloadRootGroup: reloadRootGroup,
        findGroup: findGroup,
        findCollection: findCollection,
        moveGroup: moveGroup,
        setRootGroup: setRootGroup,
    };
}


export function useCreateGroup() {

    const [showDialog, setShowDialog] = useState(false);
    const [parentGroupId, setParentGroupId] = useState(null);
    const { findGroup } = useGroups();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();

    const parentGroup: Group | null = findGroup(parentGroupId);

    const open = (parentGroupId?: number) => {
        setParentGroupId(parentGroupId ? parentGroupId : null);
        setShowDialog(true);
    };

    const close = () => {
        setShowDialog(false);
    };

    const create = (name: string) => {
        requestCreateGroup(name.trim(), parentGroupId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_CREATE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => close());
    };

    return {
        showCreateGroup: showDialog,
        createGroupParentGroup: parentGroup,
        openCreateGroup: open,
        cancelCreateGroup: close,
        createGroup: create,
    };

}


export function useRenameGroup() {

    const { showDialog, openDialog, closeDialog, acceptDialog } = useDialogHook();
    const [groupId, setGroupId] = useState(null);

    const { findGroup } = useGroups();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();


    const open = (groupId: number) => {
        setGroupId(groupId);
        openDialog();
    };

    const rename = (groupId:number, name: string) => {
        requestRenameGroup(groupId, name.trim())
            .catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_RENAME_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => acceptDialog());
    };

    return {
        showRenameGroup: showDialog,
        groupToRename: findGroup(groupId),
        openRenameGroup: open,
        cancelRenameGroup: closeDialog,
        renameGroup: rename,
    };

}


export function useDeleteGroup() {

    const { showDialog, openDialog, closeDialog, acceptDialog } = useDialogHook();
    const [groupId, setGroupId] = useState(null);

    const { findGroup } = useGroups();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();


    const open = (groupId: number) => {
        setGroupId(groupId);
        openDialog();
    };

    const deleteGroup = (groupId:number, deleteChildren: boolean) => {
        requestDeleteGroup(groupId, deleteChildren)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => acceptDialog());
    };

    return {
        showDeleteGroup: showDialog,
        groupToDelete: findGroup(groupId),
        openDeleteGroup: open,
        cancelDeleteGroup: closeDialog,
        deleteGroup: deleteGroup,
    };

}

export function useGroupName(initialName?:string) {

    const [name, setName, refName] = useStateRef(initialName ? initialName : "");
    const [valid, setValid] = useState(true);

    const changeName = (name: string) => {
        setName(name);
        setValid(name.trim().length > 0);
    };

    return {
        name: name,
        getRefName: () => refName.current,
        setName: changeName,
        nameValid: valid,
    };
}
