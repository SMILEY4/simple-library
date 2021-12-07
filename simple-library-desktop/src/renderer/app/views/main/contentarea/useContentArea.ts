import {CollectionDTO, ItemFilterDTO} from "../../../../../common/events/dtoModels";
import {useActiveCollection, useItemPage} from "../../../hooks/store/collectionActiveState";
import {useFindCollection} from "../../../hooks/store/collectionsState";
import {useLoadItems} from "../../../hooks/core/itemsLoad";
import {useEffect, useRef, useState} from "react";

export function useContentArea() {

	const activeCollectionId = useActiveCollection();
	const page = useItemPage();
	const findCollection = useFindCollection();
	const loadItems = useLoadItems();
	const activeCollection: CollectionDTO | null = findCollection(activeCollectionId);
	const scrollContentRef = useRef();
	const [view, setView] = useState<"list" | "grid">("grid");
	const [filter, setFilterState] = useState<ItemFilterDTO | null>(null);

	useEffect(() => {
		gotoPage(0);
		setFilterState(null);
	}, [activeCollectionId]);

	function gotoPage(pageIndex: number) {
		if (pageIndex !== page.index) {
			loadItems({pageIndex: pageIndex}).then();
			if (scrollContentRef.current) {
				if (view === "grid") {
					(scrollContentRef.current as any).scrollTop = 0;
				}
				if (view === "list") {
					(scrollContentRef.current as any).scrollToTop();
				}
			}
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

	function setFilter(filter: ItemFilterDTO | null) {
		setFilterState(filter);
		return loadItems({pageIndex: 0})
	}

	return {
		activeCollection: activeCollection,
		page: page,
		gotoPage: gotoPage,
		setPageSize: setPageSize,
		view: view,
		setView: setContentView,
		scrollContentRef: scrollContentRef,
		filter: filter,
		setFilter: setFilter
	};
}


