import React from "react";
import {HBox, VBox} from "../../../../newcomponents/layout/box/Box";
import {ItemData} from "../../../../../common/commonModels";
import {concatClasses, getIf} from "../../../../components/common/common";
import "./listItemEntry.css"
import {getSelectModifier, SelectModifier} from "../../../../newcomponents/utils/common";

interface ItemListEntryProps {
	item: ItemData,
	selected: boolean,
	onSelect: (selectMod: SelectModifier) => void
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

	return (
		<div onClick={handleClick}>
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
	);

	function handleClick(event: React.MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		props.onSelect(getSelectModifier(event))
	}

}
