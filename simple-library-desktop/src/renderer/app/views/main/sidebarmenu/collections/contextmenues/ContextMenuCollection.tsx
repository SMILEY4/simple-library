import React from "react";
import {Menu} from "../../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../../components/menu/menuitem/MenuItem";

interface ContextMenuCollectionProps {
	collectionId: number,
	onEdit: () => void,
	onDelete: () => void,
	__onActionInternal?: (itemId: string) => void,
}

export function ContextMenuCollection(props: React.PropsWithChildren<ContextMenuCollectionProps>): React.ReactElement {

	return (
		<Menu __onActionInternal={props.__onActionInternal}>
			<MenuItem itemId={"edit"} onAction={props.onEdit}>Edit</MenuItem>
			<MenuItem itemId={"delete"} onAction={props.onDelete}>Delete</MenuItem>
		</Menu>
	);
}
