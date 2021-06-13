import React from "react";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {CollectionType, ItemData} from "../../../../../common/commonModels";
import {concatClasses, getIf, getSelectModifier, SelectModifier} from "../../../../components/utils/common";
import "./listItemEntry.css"
import {ContextMenuWrapper} from "../../../../components/menu/contextmenu/ContextMenuWrapper";
import {Slot} from "../../../../components/base/slot/Slot";
import {ItemListEntryContextMenu} from "./ItemListEntryContextMenu";
import {APP_ROOT_ID} from "../../../Application";

interface ItemListEntryProps {
	item: ItemData,
	activeCollectionType: CollectionType,
	selected: boolean,
	onSelect: (selectMod: SelectModifier) => void,
	onDragStart: (event: React.DragEvent) => void
	onRemove: () => void,
	onDelete: () => void
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

	return (
		<ContextMenuWrapper modalRootId={APP_ROOT_ID} onOpenMenu={handleOpenContextMenu}>

			<Slot name={"target"}>
				<div onClick={handleClick} draggable onDragStart={props.onDragStart}>
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
							<li>{props.item.timestamp}</li>
							<li>{props.item.hash}</li>
						</VBox>
					</HBox>
				</div>
			</Slot>

			<Slot name={"menu"}>
				<ItemListEntryContextMenu
					canRemove={props.activeCollectionType !== CollectionType.SMART}
					onDelete={props.onDelete}
					onRemove={props.onRemove}
				/>
			</Slot>

		</ContextMenuWrapper>
	);

	function handleClick(event: React.MouseEvent): void {
		event.preventDefault();
		event.stopPropagation();
		props.onSelect(getSelectModifier(event))
	}

	function handleOpenContextMenu() {
		if(!props.selected) {
			props.onSelect(SelectModifier.NONE)
		}
	}

}
