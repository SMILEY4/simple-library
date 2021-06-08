import React from "react";
import {HBox, VBox} from "../../../../newcomponents/layout/box/Box";
import {ItemData} from "../../../../../common/commonModels";
import "./listItemEntry.css"

interface ItemListEntryProps {
	item: ItemData,
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

	return (
		<HBox alignMain="start" alignCross="stretch" className="list-item-entry">
			<img src={props.item.thumbnail} alt='img' draggable={false} />
			<VBox padding="1" spacing="0-5" alignMain="center" alignCross="start">
				<li>{props.item.id}</li>
				<li>{props.item.filepath}</li>
				<li>{props.item.timestamp}</li>
				<li>{props.item.hash}</li>
			</VBox>
		</HBox>
	);

}
