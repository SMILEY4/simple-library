import {fetchItems} from "../../common/eventInterface";
import {ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";

export function useLoadItems() {

	const activeCollection = useActiveCollection();
	const dispatchSetItems = useDispatchSetItems();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(collectionId?: number) {
		if (collectionId !== undefined) {
			return loadItems(collectionId)
		} else {
			if (activeCollection === null || activeCollection === undefined) {
				return clearItems()
			} else {
				return loadItems(activeCollection)
			}
		}
	}

	function loadItems(collectionId: number) {
		return fetchItems(collectionId, true, false)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}

	function clearItems() {
		dispatchSetItems([]);
	}

	return hookFunction;
}
