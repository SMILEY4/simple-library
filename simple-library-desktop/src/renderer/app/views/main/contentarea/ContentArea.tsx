import React from "react";
import {MemoizedItemList} from "./itemlist/ItemList";
import {VBox} from "../../../../components/layout/box/Box";
import {useContentArea} from "./useContentArea";
import {MemoizedItemGrid} from "./itemgrid/ItemGrid";
import {ItemListFooter} from "./ItemListFooter";
import {ItemFilterDTO} from "../../../../../common/events/dtoModels";

interface ContentAreaProps {
}

export function ContentArea(props: React.PropsWithChildren<ContentAreaProps>): React.ReactElement {

	const {
		activeCollection,
		page,
		gotoPage,
		setPageSize,
		view,
		setView,
		scrollContentRef,
		filter,
		setFilter
	} = useContentArea();

	return activeCollection && (
		<VBox alignMain="start" alignCross="stretch" fill>

			<div style={{
				backgroundColor: "var(--color-background-1)",
				borderBottom: "1px solid var(--color-border)",
				padding: "var(--s-0-5)"
			}}>
				{activeCollection.name}
			</div>

			{view === "list" && <MemoizedItemList activeCollection={activeCollection} scrollContentRef={scrollContentRef}/>}
			{view === "grid" && <MemoizedItemGrid activeCollection={activeCollection} scrollContentRef={scrollContentRef}/>}

			<ItemListFooter
				itemCount={page.total}
				currentPage={page.index}
				pageSize={page.size}
				onGotoPage={gotoPage}
				onSetPageSize={setPageSize}
				view={view}
				onSetView={setView}
				currentFilter={filter}
				onSetFilter={setFilter}
			/>

		</VBox>
	);

}
