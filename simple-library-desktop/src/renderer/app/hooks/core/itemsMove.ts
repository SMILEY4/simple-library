import {fetchItems, fetchRootGroup, requestMoveItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {GroupDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";

export function useMoveItems() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	const itemAttributeKeys: string[] = ["File.FileName", "File.FileCreateDate", "File.FileSize", "File.FileType", "JFIF.JFIFVersion", "PNG.Gamma"];

	function hookFunction(itemIds: number[], srcCollectionId: number, tgtCollectionId: number, copy: boolean) {
		Promise.resolve()
			.then(() => moveItems(itemIds, srcCollectionId, tgtCollectionId, copy))
			.then(() => Promise.all([
				updateItemState(activeCollectionId),
				updateGroupState()
			]));
	}

	function moveItems(itemIds: number[], srcCollectionId: number, tgtCollectionId: number, copy: boolean) {
		return requestMoveItems(srcCollectionId, tgtCollectionId, itemIds, copy)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_MOVE_FAILED, error));
	}

	function updateItemState(collectionId: number) {
		return fetchItems(collectionId, itemAttributeKeys, true)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group))
	}


	return hookFunction;
}