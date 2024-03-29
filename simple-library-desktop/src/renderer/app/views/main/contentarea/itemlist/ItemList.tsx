import React, {ReactElement, useImperativeHandle, useState} from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {ContextMenuBase} from "../../../../../components/menu/contextmenu/ContextMenuBase";
import {APP_ROOT_ID} from "../../../../Application";
import {ItemListEntryContextMenu} from "../ItemListEntryContextMenu";
import {useContextMenu} from "../../../../../components/menu/contextmenu/contextMenuHook";
import {SelectModifier} from "../../../../../components/utils/common";
import {DialogDeleteItems} from "../DialogDeleteItems";
import {CollectionDTO, ItemDTO} from "../../../../../../common/events/dtoModels";
import {useItemList} from "../useItemList";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../../hooks/store/dialogState";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";
import {ItemListEntry} from "./ItemListEntry";

interface ItemListProps {
	activeCollection: CollectionDTO,
	scrollContentRef: any;
}

export const MemoizedItemList = React.memo(ItemList,
	(prev: ItemListProps, next: ItemListProps) => {
		// dont re-render when active-collection is same (might be diff reference but same value)
		return prev.activeCollection.id === next.activeCollection.id;
	});

const cache = new CellMeasurerCache({
	fixedWidth: true,
	defaultHeight: 226
});

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const [scrollY, setScrollY] = useState(undefined);

	useImperativeHandle(props.scrollContentRef, () => ({
		scrollToTop() {
			setScrollY(0);
		}
	}));

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
			>
				<div style={{flex: "1 1 auto"}}>
					<AutoSizer>
						{({height, width}) => (
							<List
								onScroll={() => setScrollY(undefined)}
								scrollTop={scrollY}
								width={width}
								height={height}
								deferredMeasurementCache={cache}
								estimatedRowSize={226}
								rowHeight={cache.rowHeight}
								rowCount={items.length}
								rowRenderer={renderRow}
							/>
						)}
					</AutoSizer>
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

	function renderRow(data: { index: number, key: string, style: any, parent: any }): ReactElement {
		const item: ItemDTO = items[data.index];
		return (
			<CellMeasurer
				cache={cache}
				key={data.key}
				columnIndex={0}
				rowIndex={data.index}
				parent={data.parent}
			>
				{({measure, registerChild}) => (
					<div ref={registerChild} style={data.style}>
						<ItemListEntry
							item={item}
							activeCollectionType={props.activeCollection ? props.activeCollection.type : undefined}
							selected={isSelected(item.id)}
							onSelect={handleSelectItem}
							onOpen={openItemExternal}
							onDragStart={handleDragItem}
							onContextMenu={handleOnContextMenu}
							onUpdateAttributeValue={handleUpdateItemAttributeValue}
							onLoadImage={measure}
						/>
					</div>
				)}

			</CellMeasurer>
		);
	}

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
