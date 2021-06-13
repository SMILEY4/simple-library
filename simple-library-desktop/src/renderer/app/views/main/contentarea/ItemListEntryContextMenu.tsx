import React from "react";
import {Menu} from "../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../components/menu/menuitem/MenuItem";

interface ItemListEntryContextMenuProps {
	canRemove: boolean,
	onRemove: () => void
	onDelete: () => void,
	__onActionInternal?: (itemId: string) => void,
}

export function ItemListEntryContextMenu(props: React.PropsWithChildren<ItemListEntryContextMenuProps>): React.ReactElement {

	return (
		<Menu __onActionInternal={props.__onActionInternal}>
			<MenuItem itemId={"remove"} onAction={props.onRemove} disabled={!props.canRemove}>Remove from Collection</MenuItem>
			<MenuItem itemId={"delete"} onAction={props.onDelete}>Delete</MenuItem>
		</Menu>
	);
}
