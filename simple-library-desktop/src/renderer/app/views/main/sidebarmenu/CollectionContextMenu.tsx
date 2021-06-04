import React from "react";
import {Menu} from "../../../../newcomponents/menu/menu/Menu";
import {MenuItem} from "../../../../newcomponents/menu/menuitem/MenuItem";

interface CollectionContextMenuProps {
	collectionId: string,
	onEdit: () => void
	onDelete: () => void
}

export function CollectionContextMenu(props: React.PropsWithChildren<CollectionContextMenuProps>): React.ReactElement {
	return (
		<Menu>
			<MenuItem itemId={"edit"} onAction={props.onEdit}>Edit</MenuItem>
			<MenuItem itemId={"delete"} onAction={props.onDelete}>Delete</MenuItem>
		</Menu>
	);
}
