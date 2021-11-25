import {fetchItems, fetchRootGroup, requestEditCollection} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {GroupDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {TEMP_ATTRIBUTE_KEYS} from "./temp";

export function useEditCollection() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchClearSelection = useDispatchItemSelectionClear()
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(collectionId: number, name: string, query: string | null) {
		return Promise.resolve()
			.then(() => edit(collectionId, name, query))
			.then(() => updateGroupState())
			.then(() => handleActiveCollection(collectionId))
	}

	function edit(collectionId: number, name: string, query: string | null) {
		return requestEditCollection(collectionId, name, query)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))

	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	function handleActiveCollection(collectionId: number) {
		if (activeCollectionId === collectionId) {
			dispatchClearSelection();
			return updateItemState(collectionId)
		}
	}

	function updateItemState(collectionId: number) {
		return fetchItems(collectionId, TEMP_ATTRIBUTE_KEYS, true, false)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}

	return hookFunction;
}
