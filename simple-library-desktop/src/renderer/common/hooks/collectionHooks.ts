import { useGlobalState, useNotifications } from './miscHooks';
import { ActionType } from '../../store/reducer';
import { fetchItems, requestCreateCollection } from '../messaging/messagingInterface';
import { CollectionType, Group, ItemData } from '../../../common/commonModels';
import { genNotificationId } from '../utils/notificationUtils';
import { AppNotificationType } from '../../store/state';
import { useState } from 'react';
import { useRootGroup } from './groupHooks';


export function useActiveCollection() {

    const { state, dispatch } = useGlobalState();
    const { addNotification } = useNotifications();

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

    return {
        activeCollectionId: state.activeCollectionId,
        setActiveCollection: setActive,
    };
}


export function useCreateCollection() {

    const [showDialog, setShowDialog] = useState(false);
    const [parentGroupId, setParentGroupId] = useState(null);
    const { findGroup } = useRootGroup();
    const { addNotification } = useNotifications();
    const { reloadRootGroup } = useRootGroup();

    const parentGroup: Group | null = findGroup(parentGroupId);

    const open = (parentGroupId?: number) => {
        setParentGroupId(parentGroupId ? parentGroupId : null);
        setShowDialog(true);
    };

    const close = () => {
        setShowDialog(false);
    };

    const create = (name: string, type: CollectionType, query: string) => {
        requestCreateCollection(name.trim(), type, query.trim(), parentGroupId)
            .catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
            .then(() => reloadRootGroup())
            .then(() => close());
    };

    return {
        showCreateCollection: showDialog,
        createCollectionParentGroup: parentGroup,
        openCreateCollection: open,
        cancelCreateCollection: close,
        createCollection: create,
    };

}