import React from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {ContextMenuBase} from "../../../../../components/menu/contextmenu/ContextMenuBase";
import {APP_ROOT_ID} from "../../../../Application";
import {ItemListEntryContextMenu} from "../ItemListEntryContextMenu";
import {useContextMenu} from "../../../../../components/menu/contextmenu/contextMenuHook";
import {SelectModifier} from "../../../../../components/utils/common";
import {DialogDeleteItems} from "../DialogDeleteItems";
import {CollectionDTO} from "../../../../../../common/events/dtoModels";
import {useItemList} from "../useItemList";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../../hooks/store/dialogState";
import "./itemGrid.css";
import {ItemGridEntry} from "./ItemGridEntry";

interface ItemGridProps {
	activeCollection: CollectionDTO;
	scrollContentRef: any
}

export const MemoizedItemGrid = React.memo(ItemGrid,
	(prev: ItemGridProps, next: ItemGridProps) => {
		// dont re-render when active-collection is same (might be diff reference but same value)
		return prev.activeCollection.id === next.activeCollection.id;
	});

export function ItemGrid(props: React.PropsWithChildren<ItemGridProps>): React.ReactElement {

	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

	const {
		items,
		isSelected,
		itemIdsSelected,
		handleOnKeyDown,
		handleSelectItem,
		openItemExternal,
		showSelectedItem,
		openSelectedItemsExternal,
		handleDragItem,
		handleRemoveSelectedItems,
		handleUpdateItemAttributeValue
	} = useItemList(props.activeCollection.id);

	const {
		showContextMenu,
		contextMenuX,
		contextMenuY,
		contextMenuRef,
		openContextMenuWithEvent,
		closeContextMenu
	} = useContextMenu();

	return (
		<>

			<VBox
				fill
				padding="0-5"
				spacing="0-5"
				alignMain="start"
				alignCross="stretch"
				focusable
				onKeyDown={handleOnKeyDown}
				style={{minHeight: 0}}
			>
				<div className={"item-grid-container"} ref={props.scrollContentRef}>
					{items.map(item => {
						return (
							<div className={"item-grid-cell"} key={item.id}>
								<ItemGridEntry
									item={item}
									activeCollectionType={props.activeCollection ? props.activeCollection.type : undefined}
									selected={isSelected(item.id)}
									onSelect={handleSelectItem}
									onOpen={openItemExternal}
									onDragStart={handleDragItem}
									onContextMenu={handleOnContextMenu}
									onUpdateAttributeValue={handleUpdateItemAttributeValue}
									onLoadImage={undefined}
								/>
							</div>
						);
					})}
				</div>
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
					selectedItemsCount={itemIdsSelected.length}
					canRemove={props.activeCollection.type !== "smart"}
					onRemove={handleRemoveSelectedItems}
					onDelete={() => openDialogDeleteItems(itemIdsSelected, props.activeCollection.id)}
					onOpen={openSelectedItemsExternal}
					onShow={showSelectedItem}
				/>
			</ContextMenuBase>

		</>
	);

	function openDialogDeleteItems(itemIds: number[], activeCollectionId: number | null) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogDeleteItems
				itemIds={itemIds}
				activeCollectionId={activeCollectionId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function handleOnContextMenu(itemId: number, event: React.MouseEvent): void {
		if (!isSelected(itemId)) {
			handleSelectItem(itemId, SelectModifier.NONE);
		}
		openContextMenuWithEvent(event);
	}

}
