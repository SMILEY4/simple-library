import React from "react";
import {VBox} from "../../../../components/layout/box/Box";
import {ItemListEntry} from "./ItemListEntry";
import {Collection, CollectionType, ItemData} from "../../../../../common/commonModels";
import {useItemList} from "../../../hooks/app/contentarea/useItemList";
import {ContextMenuBase} from "../../../../components/menu/contextmenu/ContextMenuBase";
import {APP_ROOT_ID} from "../../../Application";
import {ItemListEntryContextMenu} from "./ItemListEntryContextMenu";
import {useContextMenu} from "../../../../components/menu/contextmenu/contextMenuHook";
import {SelectModifier} from "../../../../components/utils/common";

interface ItemListProps {
	activeCollection: Collection
}

export const MemoizedItemList = React.memo(ItemList,
	(prev: ItemListProps, next: ItemListProps) => {
		// dont re-render when active-collection is same (might be diff reference but same value)
		return prev.activeCollection.id === next.activeCollection.id;
	})

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		items,
		isSelected,
		handleOnKeyDown,
		handleSelectItem,
		handleDragItem,
		handleDeleteSelectedItems,
		handleRemoveSelectedItems
	} = useItemList(props.activeCollection.id)

	const {
		showContextMenu,
		contextMenuX,
		contextMenuY,
		contextMenuRef,
		openContextMenuWithEvent,
		closeContextMenu
	} = useContextMenu()

	return (
		<>

			<VBox
				fill
				padding="0-5"
				spacing="0-5"
				alignMain="start"
				alignCross="stretch"
				overflow="auto"
				focusable
				onKeyDown={handleOnKeyDown}
			>
				{items && items.map((itemData: ItemData) => <ItemListEntry
					key={itemData.id}
					item={itemData}
					activeCollectionType={props.activeCollection ? props.activeCollection.type : undefined}
					selected={isSelected(itemData.id)}
					onSelect={handleSelectItem}
					onDragStart={handleDragItem}
					onRemove={handleRemoveSelectedItems}
					onDelete={handleDeleteSelectedItems}
					onContextMenu={handleOnContextMenu}
				/>)}
			</VBox>

			<ContextMenuBase
				modalRootId={APP_ROOT_ID}
				show={showContextMenu}
				pageX={contextMenuX}
				pageY={contextMenuY}
				menuRef={contextMenuRef}
				onRequestClose={closeContextMenu}
			>
				<ItemListEntryContextMenu
					canRemove={props.activeCollection.type !== CollectionType.SMART}
					onRemove={handleRemoveSelectedItems}
					onDelete={handleDeleteSelectedItems}
				/>
			</ContextMenuBase>

		</>
	);

	function handleOnContextMenu(itemId: number, event: React.MouseEvent): void {
		if (!isSelected(itemId)) {
			handleSelectItem(itemId, SelectModifier.NONE);
		}
		openContextMenuWithEvent(event)
	}

}
