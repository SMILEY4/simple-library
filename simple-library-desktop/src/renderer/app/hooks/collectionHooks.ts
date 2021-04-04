import { useDialogHook, useGlobalState, useNotifications, useStateRef } from './miscHooks';
import { ActionType } from '../store/reducer';
import {
    fetchItems,
    requestCreateCollection,
    requestDeleteCollection,
    requestEditCollection,
    requestMoveCollection,
} from '../common/messaging/messagingInterface';
import { CollectionType, Group, ItemData } from '../../../common/commonModels';
import { genNotificationId } from '../common/utils/notificationUtils';
import { AppNotificationType } from '../store/state';
import { useState } from 'react';
import { useGroups } from './groupHooks';


export function useCollections() {

    const { state, dispatch } = useGlobalState();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();

    const setActive = (collectionId: number | null) => {
        dispatch({
            type: ActionType.SET_CURRENT_COLLECTION_ID,
            payload: collectionId,
        });
        if (collectionId) {
            fetchItems(collectionId)
                .then((items: ItemData[]) => {
                    dispatch({
                        type: ActionType.SET_ITEMS,
                        payload: items,
                    });
                })
                .catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error));
        } else {
            dispatch({
                type: ActionType.SET_ITEMS,
                payload: [],
            });
        }
    };

    const moveCollection = (collectionId: number, targetGroupId: number | null) => {
        requestMoveCollection(collectionId, targetGroupId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
            .then(() => reloadRootGroup());
    };

    return {
        activeCollectionId: state.activeCollectionId,
        setActiveCollection: setActive,
        moveCollection: moveCollection,
    };
}


export function useCreateCollection() {

    const { showDialog, openDialog, closeDialog, acceptDialog } = useDialogHook();
    const [parentGroupId, setParentGroupId] = useState(null);
    const { findGroup } = useGroups();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();

    const parentGroup: Group | null = findGroup(parentGroupId);

    const open = (parentGroupId?: number) => {
        setParentGroupId(parentGroupId ? parentGroupId : null);
        openDialog();
    };

    const create = (name: string, type: CollectionType, query: string) => {
        requestCreateCollection(name.trim(), type, query.trim(), parentGroupId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => acceptDialog());
    };

    return {
        showCreateCollection: showDialog,
        createCollectionParentGroup: parentGroup,
        openCreateCollection: open,
        cancelCreateCollection: closeDialog,
        createCollection: create,
    };

}

export function useEditCollection() {

    const { showDialog, openDialog, closeDialog, acceptDialog } = useDialogHook();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();
    const [collectionId, setCollectionId] = useState<number>();

    const open = (collectionId: number) => {
        setCollectionId(collectionId);
        openDialog();
    };

    const edit = (collectionId: number, name: string, query: string) => {
        requestEditCollection(collectionId, name.trim(), query.trim())
            .catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => acceptDialog());
    };

    return {
        showEditCollection: showDialog,
        editCollectionId: collectionId,
        openEditCollection: open,
        cancelEditCollection: closeDialog,
        editCollection: edit,
    };

}


export function useDeleteCollection() {

    const { showDialog, openDialog, closeDialog, acceptDialog } = useDialogHook();
    const [collectionId, setCollectionId] = useState<number>();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useGroups();
    const { activeCollectionId, setActiveCollection } = useCollections();

    const open = (collectionId: number) => {
        setCollectionId(collectionId);
        openDialog();
    };

    const deleteCollection = (collectionId: number) => {
        requestDeleteCollection(collectionId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => {
                if (activeCollectionId === collectionId) {
                    setActiveCollection(null);
                }
            })
            .then(() => acceptDialog());
    };

    return {
        showDeleteCollection: showDialog,
        deleteCollectionId: collectionId,
        openDeleteCollection: open,
        cancelDeleteCollection: closeDialog,
        deleteCollection: deleteCollection,
    };

}


export function useCollectionName(initialName?: string) {

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


export function useCollectionType(initialType?: CollectionType) {
    const [type, setType, refType] = useStateRef(initialType ? initialType : CollectionType.NORMAL);
    return {
        type: type,
        getRefType: () => refType.current,
        setType: setType,
        isNormal: () => type === CollectionType.NORMAL,
        isSmart: () => type === CollectionType.SMART,
    };
}


export function useCollectionQuery(initialQuery?: string) {
    const [query, setQuery, refQuery] = useStateRef(initialQuery ? initialQuery : "");
    return {
        query: query,
        getRefQuery: () => refQuery.current,
        setQuery: setQuery,
    };
}