import { ActionType } from '../../store/reducer';
import { Collection, extractCollections, extractGroups, Group } from '../../../../common/commonModels';
import { genNotificationId } from '../utils/notificationUtils';
import { AppNotificationType } from '../../store/state';
import { useState } from 'react';
import { fetchRootGroup, requestCreateGroup, requestMoveGroup } from '../messaging/messagingInterface';
import { useGlobalState, useNotifications } from './miscHooks';


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
