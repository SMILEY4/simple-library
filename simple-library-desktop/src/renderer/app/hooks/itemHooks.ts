import {useGlobalState} from "./old/miscAppHooks";
import {fetchItems} from "../common/messaging/messagingInterface";
import {useNotifications} from "./notificationHooks";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {ItemData} from "../../../common/commonModels";
import {ActionType} from "../store/reducer";

export function useItems() {

	const {state, dispatch} = useGlobalState();
	const {addNotification} = useNotifications()

	function load(collectionId: number): void {
		fetchItems(collectionId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemData[]) => dispatch({
				type: ActionType.SET_ITEMS,
				payload: items,
			}));
	}

	function clear(): void {
		dispatch({
			type: ActionType.SET_ITEMS,
			payload: [],
		})
	}

	function importItems(): void {
		// todo
		console.log("NOT IMPLEMENTED: import items")
	}

	return {
		items: state.items,
		loadItems: load,
		clearItems: clear,
		importItems: importItems
	}
}