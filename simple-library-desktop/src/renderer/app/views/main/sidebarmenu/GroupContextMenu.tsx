import React from "react";
import {Menu} from "../../../../newcomponents/menu/menu/Menu";
import {SubMenuItem} from "../../../../newcomponents/menu/submenu/SubMenuItem";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {MenuItem} from "../../../../newcomponents/menu/menuitem/MenuItem";

interface GroupContextMenuProps {
	groupId: string,
	onCreateGroup: () => void,
	onCreateCollection: () => void,
	onEdit: () => void
	onDelete: () => void
}

export function GroupContextMenu(props: React.PropsWithChildren<GroupContextMenuProps>): React.ReactElement {
	return (
		<Menu>
			<SubMenuItem itemId={"new"}>
				<Slot name={"item"}>
					New
				</Slot>
				<Slot name={"menu"}>
					<MenuItem itemId={"new.collection"} onAction={props.onCreateCollection}>Collection</MenuItem>
					<MenuItem itemId={"new.group"} onAction={props.onCreateGroup}>Group</MenuItem>
				</Slot>
			</SubMenuItem>
			<MenuItem itemId={"edit"} onAction={props.onEdit}>Edit</MenuItem>
			<MenuItem itemId={"delete"} onAction={props.onDelete}>Delete</MenuItem>
		</Menu>
	);
}
