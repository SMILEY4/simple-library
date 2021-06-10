import {
	requestCreateCollection,
	requestDeleteCollection,
	requestEditCollection,
	requestMoveCollection
} from "../common/messaging/messagingInterface";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useNotifications} from "./notificationHooks";
import {Collection, CollectionType, extractCollections} from "../../../common/commonModels";
import {useGlobalState} from "./old/miscAppHooks";
import {ActionType} from "../store/reducer";

export function useCollections() {

	const {state, dispatch} = useGlobalState();
	const {throwErrorNotification} = useNotifications();

	function move(collectionId: number, targetGroupId: number | null): Promise<void> {
		return requestMoveCollection(collectionId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
	}

	function find(collectionId: number): Collection | null {
		if (collectionId) {
			const result: Collection | undefined = extractCollections(state.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	function deleteCollection(collectionId: number): Promise<void> {
		return requestDeleteCollection(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
			.then(() => {
				if (state.activeCollectionId === collectionId) {
					closeCollection()
				}
			})
	}

	function create(parentGroupId: number | null, name: string, type: CollectionType, query: string | null): Promise<void> {
		return requestCreateCollection(name, type, type === CollectionType.SMART ? query : null, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
	}

	function edit(collectionId: number, name: string, query: string | null): Promise<void> {
		return requestEditCollection(collectionId, name, query)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))
	}

	function openCollection(collectionId: number): void {
		if (state.activeCollectionId !== collectionId) {
			if (collectionId === null || find(collectionId) === null) {
				closeCollection()
			} else {
				dispatch({
					type: ActionType.SET_CURRENT_COLLECTION_ID,
					payload: collectionId
				});
			}
		}
	}

	function closeCollection(): void {
		dispatch({
			type: ActionType.SET_CURRENT_COLLECTION_ID,
			payload: null
		});
	}

	return {
		activeCollectionId: state.activeCollectionId,
		moveCollection: move,
		findCollection: find,
		deleteCollection: deleteCollection,
		createCollection: create,
		editCollection: edit,
		openCollection: openCollection,
		closeCollection: closeCollection
	}

}