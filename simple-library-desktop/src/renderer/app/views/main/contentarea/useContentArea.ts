import {CollectionDTO} from "../../../../../common/events/dtoModels";
import {useActiveCollection} from "../../../hooks/store/collectionActiveState";
import {useFindCollection} from "../../../hooks/store/collectionsState";
import {useLoadItems} from "../../../hooks/core/itemsLoad";
import {useItemPage} from "../../../hooks/store/itemsPageState";
import {useEffect, useState} from "react";

export function useContentArea() {

	const activeCollectionId = useActiveCollection();
	const page = useItemPage();
	const findCollection = useFindCollection();
	const loadItems = useLoadItems();
	const [view, setView] = useState<"list" | "grid">("grid");

	const activeCollection: CollectionDTO | null = findCollection(activeCollectionId);


	useEffect(() => {
		gotoPage(0);
	}, [activeCollectionId]);

	function gotoPage(pageIndex: number) {
		if (pageIndex !== page.index) {
			loadItems({pageIndex: pageIndex}).then();
		}
	}

	function setPageSize(pageSize: number) {
		if (pageSize !== page.size) {
			loadItems({pageSize: pageSize}).then();
		}
	}

	function setContentView(view: "list" | "grid") {
		setView(view);
	}

	return {
		activeCollection: activeCollection,
		page: page,
		gotoPage: gotoPage,
		setPageSize: setPageSize,
		view: view,
		setView: setContentView
	};
}


