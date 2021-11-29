import {fetchRootGroup, requestMoveItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useActiveCollection} from "../store/collectionActiveState";
import {useLoadItems} from "./itemsLoad";

export function useMoveItems() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();
	const loadItems = useLoadItems();

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
		return loadItems({collectionId: collectionId});
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
