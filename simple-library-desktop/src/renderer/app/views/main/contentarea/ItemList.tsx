import React from "react";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {useItems} from "../../../hooks/itemHooks";
import {ItemListEntry} from "./ItemListEntry";

interface ItemListProps {
}

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		items,
	} = useItems();

	return (
		<VBox
			fill
			padding="0-5"
			spacing="0-5"
			alignMain="start"
			alignCross="stretch"
			overflow="auto"
		>
			{items && items.map(itemData => <ItemListEntry item={itemData}/>)}
		</VBox>
	);

}
