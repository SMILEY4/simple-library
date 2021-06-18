import {
	fetchRootGroup,
	requestCreateCollection,
	requestCreateGroup,
	requestDeleteCollection,
	requestDeleteGroup,
	requestEditCollection,
	requestMoveCollection,
	requestMoveGroup,
	requestRenameGroup
} from "../../common/messagingInterface";
import {genNotificationId} from "./notificationUtils";
import {useNotifications} from "./notificationHooks";
import {Collection, CollectionType, extractCollections, extractGroups, Group} from "../../../../common/commonModels";
import {AppNotificationType} from "../../store/notificationState";
import {CollectionActiveActionType, useCollectionActiveState} from "../../store/collectionActiveState";
import {CollectionsActionType, useCollectionsState} from "../../store/collectionsState";

export function useCollections() {

	const [collectionsState, collectionsDispatch] = useCollectionsState();
	const {throwErrorNotification} = useNotifications()

	function findCollection(collectionId: number): Collection | null {
		if (collectionId) {
			const result: Collection | undefined = extractCollections(collectionsState.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	function findGroup(groupId: number): Group | null {
		const result: Group | undefined = extractGroups(collectionsState.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	function loadGroups(): Promise<void> {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: Group) => {
				collectionsDispatch({
					type: CollectionsActionType.SET_ROOT_GROUP,
					payload: group,
				});
			})
	}

	function moveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
		return requestMoveGroup(groupId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_MOVE_FAILED, error))
			.then(() => loadGroups());
	}

	function deleteGroup(groupId: number, keepContent: boolean): Promise<void> {
		return requestDeleteGroup(groupId, !keepContent)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
			.then(() => loadGroups())
	}

	function createGroup(parentGroupId: number | null, name: string): Promise<void> {
		return requestCreateGroup(name, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_CREATE_FAILED, error))
			.then(() => loadGroups())
	}

	function renameGroup(groupId: number, newName: string): Promise<void> {
		return requestRenameGroup(groupId, newName)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_RENAME_FAILED, error))
			.then(() => loadGroups())
	}

	return {
		rootGroup: collectionsState.rootGroup,
		findCollection: findCollection,
		findGroup: findGroup,
		loadGroups: loadGroups,
		moveGroup: moveGroup,
		deleteGroup: deleteGroup,
		createGroup: createGroup,
		renameGroup: renameGroup
	}

}


export function useActiveCollection() {

	const [activeCollectionState, activeCollectionDispatch] = useCollectionActiveState();

	function open(collectionId: number): void {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			activeCollectionDispatch({
				type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
				payload: collectionId
			});
		}
	}

	function close(): void {
		activeCollectionDispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: null
		});
	}

	return {
		activeCollectionId: activeCollectionState.activeCollectionId,
		openCollection: open,
		closeCollection: close,
	}
}


export function useCollectionsStateless() {

	const {throwErrorNotification} = useNotifications();

	function move(collectionId: number, targetGroupId: number | null): Promise<void> {
		return requestMoveCollection(collectionId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
	}

	function create(parentGroupId: number | null, name: string, type: CollectionType, query: string | null): Promise<void> {
		return requestCreateCollection(name, type, type === CollectionType.SMART ? query : null, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
	}

	function edit(collectionId: number, name: string, query: string | null): Promise<void> {
		return requestEditCollection(collectionId, name, query)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))
	}

	function deleteCollection(collectionId: number): Promise<void> {
		return requestDeleteCollection(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
	}

	return {
		moveCollection: move,
		createCollection: create,
		editCollection: edit,
		deleteCollection: deleteCollection
	}

}
