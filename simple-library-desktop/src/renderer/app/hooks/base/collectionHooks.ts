import {
	requestCreateCollection,
	requestDeleteCollection,
	requestEditCollection,
	requestMoveCollection
} from "../../common/messagingInterface";
import {genNotificationId} from "./notificationUtils";
import {useNotifications} from "./notificationHooks";
import {Collection, CollectionType, extractCollections} from "../../../../common/commonModels";
import {AppNotificationType} from "../../store/notificationState";
import {CollectionActiveActionType, useCollectionActiveState} from "../../store/collectionActiveState";
import {useCollectionsState} from "../../store/collectionsState";

export function useCollections() {

	const [collectionsState] = useCollectionsState();

	function find(collectionId: number): Collection | null {
		if (collectionId) {
			const result: Collection | undefined = extractCollections(collectionsState.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	return {
		findCollection: find,
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
