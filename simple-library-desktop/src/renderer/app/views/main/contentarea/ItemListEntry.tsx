import React from "react";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {CollectionType, ItemData, MetadataEntry} from "../../../../../common/commonModels";
import {concatClasses, getIf, getSelectModifier, SelectModifier} from "../../../../components/utils/common";
import "./listItemEntry.css"

interface ItemListEntryProps {
	item: ItemData,
	activeCollectionType: CollectionType,
	selected: boolean,
	onSelect: (itemId: number, selectMod: SelectModifier) => void,
	onOpen: (itemId: number) => void,
	onDragStart: (itemId: number, event: React.DragEvent) => void
	onContextMenu: (itemId: number, event: React.MouseEvent) => void,
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

	return (
		<div
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			draggable
			onDragStart={handleOnDragStart}
			onContextMenu={handleContextMenu}
		>
			<HBox
				alignMain="start"
				alignCross="stretch"
				className={concatClasses(
					"list-item-entry",
					getIf(props.selected, "list-item-entry-selected")
				)}
			>
				<img src={props.item.thumbnail} alt='img' draggable={false}/>
				<VBox padding="1" spacing="0-5" alignMain="center" alignCross="start">
					<li>{props.item.id}</li>
					<li>{props.item.filepath}</li>
					{props.item.metadataEntries.map((entry: MetadataEntry) => {
						return <li>{entry.key + ":" + entry.type + " = " + entry.value}</li>
					})}
				</VBox>
			</HBox>
		</div>
	);

	function handleOnDragStart(event: React.DragEvent): void {
		props.onDragStart(props.item.id, event)
	}

	function handleClick(event: React.MouseEvent): void {
		event.preventDefault();
		event.stopPropagation();
		props.onSelect(props.item.id, getSelectModifier(event))
	}

	function handleDoubleClick(): void {
		props.onOpen(props.item.id);
	}

	function handleContextMenu(event: React.MouseEvent): void {
		props.onContextMenu(props.item.id, event)
	}

}
