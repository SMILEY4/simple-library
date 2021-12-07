import {fetchItems} from "../../common/eventInterface";
import {ItemFilterDTO, ItemPageDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection, useDispatchSetItemPage, useItemFilter, useItemPage} from "../store/collectionActiveState";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {voidThen} from "../../../../common/utils";

export function useLoadItems() {

	const activeCollection = useActiveCollection();
	const currentPage = useItemPage();
	const currentFilter = useItemFilter();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSetPage = useDispatchSetItemPage();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(data: ({ pageIndex?: number, pageSize?: number, collectionId?: number, filter?: ItemFilterDTO | null })): Promise<void> {
		const collectionId = data.collectionId !== undefined ? data.collectionId : activeCollection;
		const pageIndex = data.pageIndex !== undefined ? data.pageIndex : currentPage.index;
		const pageSize = data.pageSize !== undefined ? data.pageSize : currentPage.size;
		const filter = data.filter !== undefined ? data.filter : currentFilter;
		if (collectionId === null || collectionId === undefined) {
			return clearItems();
		} else {
			return loadItems(collectionId, pageIndex, pageSize, filter);
		}
	}

	function loadItems(collectionId: number, pageIndex: number, pageSize: number, filter: ItemFilterDTO | null) {
		return fetchItems(collectionId, true, true, pageIndex, pageSize, filter)
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
