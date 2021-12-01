import {fetchItems} from "../../common/eventInterface";
import {ItemPageDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {voidThen} from "../../../../common/utils";
import {useDispatchSetItemPage, useItemPage} from "../store/itemsPageState";

export function useLoadItems() {

	const activeCollection = useActiveCollection();
	const currentPage = useItemPage();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSetPage = useDispatchSetItemPage();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(data: ({ pageIndex?: number, pageSize?: number, collectionId?: number })): Promise<void> {
		const collectionId = data.collectionId !== undefined ? data.collectionId : activeCollection;
		const pageIndex = data.pageIndex !== undefined ? data.pageIndex : currentPage.index;
		const pageSize = data.pageSize !== undefined ? data.pageSize : currentPage.size;
		if (collectionId === null || collectionId === undefined) {
			return clearItems();
		} else {
			return loadItems(collectionId, pageIndex, pageSize);
		}
	}

	function loadItems(collectionId: number, pageIndex: number, pageSize: number) {
		return fetchItems(collectionId, true, true, pageIndex, pageSize)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((itemPage: ItemPageDTO) => {
				dispatchSetItems(itemPage.items);
				dispatchSetPage({
					index: itemPage.pageIndex,
					size: itemPage.pageSize,
					total: itemPage.totalCount
				});
			})
			.then(voidThen);
	}

	function clearItems() {
		dispatchSetItems([]);
		dispatchSetPage({index: 0, size: 0, total: 0});
		return Promise.resolve();
	}

	return hookFunction;
}
