import {useCollectionActiveContext, useDispatchSetActiveCollection} from "../store/collectionActiveState";
import {fetchItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {TEMP_ATTRIBUTE_IDS} from "./temp";

export function useOpenCollection() {

	const [activeCollectionState] = useCollectionActiveContext();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSetActiveCollection = useDispatchSetActiveCollection();
	const dispatchClearSelection = useDispatchItemSelectionClear();
	const throwErrorNotification = useThrowErrorWithNotification();


	function hookFunction(collectionId: number) {
		if (activeCollectionState.activeCollectionId !== collectionId) {
			dispatchSetActiveCollection(collectionId);
			dispatchClearSelection();
			loadItemState(collectionId);
		}
	}

	function loadItemState(collectionId: number) {
		fetchItems(collectionId, TEMP_ATTRIBUTE_IDS, true, false)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}

	return hookFunction;
}
