import {fetchItems, fetchRootGroup, requestEditCollection} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../../../store/notificationState";
import {GroupDTO, ItemDTO} from "../../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";
import {useActiveCollectionState} from "../../base/activeCollectionHooks";
import {useDispatchItemSelectionClear} from "../../../store/itemSelectionState";
import {useDispatchSetItems} from "../../../store/itemsState";

export function useEditCollection() {

	const {activeCollectionId} = useActiveCollectionState();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchClearSelection = useDispatchItemSelectionClear()
	const throwErrorNotification = useThrowErrorWithNotification();

	const itemAttributeKeys: string[] = ["File.FileName", "File.FileCreateDate", "File.FileSize", "File.FileType", "JFIF.JFIFVersion", "PNG.Gamma"];

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
		return fetchItems(collectionId, itemAttributeKeys, true)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}

	return hookFunction;
}
