import React from "react";
import {VBox} from "../../../../components/layout/box/Box";
import {ItemListEntry} from "./ItemListEntry";
import {Collection, ItemData} from "../../../../../common/commonModels";
import {useItemList} from "../../../hooks/app/contentarea/useItemList";

interface ItemListProps {
	activeCollection: Collection
}

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
				/>)}
			</VBox>

		</>
	);


}
