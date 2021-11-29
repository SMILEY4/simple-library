import {fetchItems} from "../../common/eventInterface";
import {ItemPageDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems, useItemPage} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {voidThen} from "../../../../common/utils";

export function useLoadItems() {

	const PAGE_SIZE = 3;

	const activeCollection = useActiveCollection();
	const currentPage = useItemPage();
	const dispatchSetItems = useDispatchSetItems();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(data: ({ page?: number, collectionId?: number })): Promise<void> {
		const collectionId = data.collectionId !== undefined ? data.collectionId : activeCollection;
		const page = data.page !== undefined ? data.page : currentPage.index;
		if (collectionId === null || collectionId === undefined) {
			return clearItems();
		} else {
			return loadItems(collectionId, page);
		}
	}

	function loadItems(collectionId: number, page: number) {
		return fetchItems(collectionId, true, true, page, PAGE_SIZE)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((itemPage: ItemPageDTO) => dispatchSetItems(
				itemPage.items,
				{
					index: itemPage.pageIndex,
					size: itemPage.pageSize,
					total: itemPage.totalCount
				}
			))
			.then(voidThen);
	}

	function clearItems() {
		dispatchSetItems([], {index: 0, size: 0, total: 0});
		return Promise.resolve();
	}

	return hookFunction;
}
