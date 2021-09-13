import React from "react";
import {VBox} from "../../../../components/layout/box/Box";
import {ItemListEntry} from "./ItemListEntry";
import {ContextMenuBase} from "../../../../components/menu/contextmenu/ContextMenuBase";
import {APP_ROOT_ID} from "../../../Application";
import {ItemListEntryContextMenu} from "./ItemListEntryContextMenu";
import {useContextMenu} from "../../../../components/menu/contextmenu/contextMenuHook";
import {SelectModifier} from "../../../../components/utils/common";
import {useDialogItemsDeleteController} from "./useDialogItemsDelete";
import {DialogDeleteItems} from "./DialogDeleteItems";
import {CollectionDTO, ItemDTO} from "../../../../../common/events/dtoModels";
import {useItemList} from "./useItemList";

interface ItemListProps {
	activeCollection: CollectionDTO
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
		itemIdsSelected,
		handleOnKeyDown,
		handleSelectItem,
		openItemExternal,
		openSelectedItemsExternal,
		handleDragItem,
		handleRemoveSelectedItems,
		handleUpdateItemAttributeValue
	} = useItemList(props.activeCollection.id)

	const [
		showDeleteItems,
		openDeleteItems,
		closeDeleteItems,
		itemIdsDelete
	] = useDialogItemsDeleteController();

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
				{items && items.map((itemData: ItemDTO) => <ItemListEntry
					key={itemData.id}
					item={itemData}
					activeCollectionType={props.activeCollection ? props.activeCollection.type : undefined}
					selected={isSelected(itemData.id)}
					onSelect={handleSelectItem}
					onOpen={openItemExternal}
					onDragStart={handleDragItem}
					onContextMenu={handleOnContextMenu}
					onUpdateAttributeValue={handleUpdateItemAttributeValue}
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
					canRemove={props.activeCollection.type !== "smart"}
					onRemove={handleRemoveSelectedItems}
					onDelete={() => openDeleteItems(itemIdsSelected)}
					onOpen={openSelectedItemsExternal}
				/>
			</ContextMenuBase>

			{showDeleteItems && (<DialogDeleteItems
				itemIds={itemIdsDelete}
				activeCollectionId={props.activeCollection.id}
				onClose={closeDeleteItems}
			/>)}

		</>
	);

	function handleOnContextMenu(itemId: number, event: React.MouseEvent): void {
		if (!isSelected(itemId)) {
			handleSelectItem(itemId, SelectModifier.NONE);
		}
		openContextMenuWithEvent(event)
	}

}
