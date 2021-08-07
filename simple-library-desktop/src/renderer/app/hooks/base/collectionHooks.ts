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
import {useModifyNotifications} from "./notificationHooks";
import {AppNotificationType} from "../../store/notificationState";
import {CollectionsActionType, useCollectionsContext, useCollectionsDispatch} from "../../store/collectionsState";
import {CollectionDTO, CollectionTypeDTO, GroupDTO} from "../../../../common/messaging/dtoModels";
import {extractCollections, extractGroups} from "../../common/utils";

export function useCollectionsState() {

	const [collectionsState] = useCollectionsContext();

	function findCollection(collectionId: number): CollectionDTO | null {
		if (collectionId) {
			const result: CollectionDTO | undefined = extractCollections(collectionsState.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	function findGroup(groupId: number): GroupDTO | null {
		const result: GroupDTO | undefined = extractGroups(collectionsState.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	return {
		rootGroup: collectionsState.rootGroup,
		findCollection: findCollection,
		findGroup: findGroup
	}
}

export function useCollections() {

	const collectionsDispatch = useCollectionsDispatch();
	const {throwErrorNotification} = useModifyNotifications()

	function loadGroups(): Promise<void> {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => {
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

	function moveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
		return requestMoveCollection(collectionId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
	}

	function createCollection(parentGroupId: number | null, name: string, type: CollectionTypeDTO, query: string | null): Promise<void> {
		return requestCreateCollection(name, type, type === "smart" ? query : null, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
	}

	function editCollection(collectionId: number, name: string, query: string | null): Promise<void> {
		return requestEditCollection(collectionId, name, query)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))
	}

	function deleteCollection(collectionId: number): Promise<void> {
		return requestDeleteCollection(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
	}

	return {
		loadGroups: loadGroups,
		moveGroup: moveGroup,
		deleteGroup: deleteGroup,
		createGroup: createGroup,
		renameGroup: renameGroup,
		moveCollection: moveCollection,
		editCollection: editCollection,
		createCollection: createCollection,
		deleteCollection: deleteCollection
	}
}
