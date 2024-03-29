import {GroupDTO, ImportProcessDataDTO, ImportResultDTO, ImportStatusDTO} from "../../../../common/events/dtoModels";
import {genNotificationId} from "../../common/notificationUtils";
import {
	AppNotificationType,
	useDispatchAddNotification,
	useDispatchRemoveNotification,
	useDispatchUpdateNotification,
	useThrowErrorWithNotification
} from "../store/notificationState";
import {
	addImportStatusListener,
	fetchRootGroup,
	removeImportStatusListener,
	requestImport
} from "../../common/eventInterface";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {useLoadItems} from "./itemsLoad";

export function useImportItems() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const notificationAdd = useDispatchAddNotification();
	const notificationRemove = useDispatchRemoveNotification();
	const notificationUpdate = useDispatchUpdateNotification();
	const throwErrorNotification = useThrowErrorWithNotification();
	const loadItems = useLoadItems();


	function hookFunction(data: ImportProcessDataDTO) {
		importItems(data)
			.then(() => updateGroupState())
			.then(() => updateItemState());
	}


	function importItems(data: ImportProcessDataDTO) {
		const importStatusNotificationId = genNotificationId();
		notificationAdd(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);

		const statusListener = (status: ImportStatusDTO) => notificationUpdate(importStatusNotificationId, status);
		addImportStatusListener(statusListener);
		return requestImport(
			data,
			(result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
			(result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
			(result: ImportResultDTO) => notificationAdd(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result)
		)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
			.then(() => notificationRemove(importStatusNotificationId))
			.finally(() => removeImportStatusListener());
	}


	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}


	function updateItemState() {
		if (activeCollectionId) {
			return loadItems({});
		} else {
			return Promise.resolve();
		}
	}


	return hookFunction;
}
