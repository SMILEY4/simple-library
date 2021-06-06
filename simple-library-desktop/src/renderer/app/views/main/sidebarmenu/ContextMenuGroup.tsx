import React from "react";
import {Menu} from "../../../../newcomponents/menu/menu/Menu";
import {SubMenuItem} from "../../../../newcomponents/menu/submenu/SubMenuItem";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {MenuItem} from "../../../../newcomponents/menu/menuitem/MenuItem";

interface ContextMenuGroupProps {
	groupId: number | null,
	onDelete: () => void,
	onEdit: () => void,
	onCreateGroup: () => void,
	onCreateCollection: () => void,
	__onActionInternal?: (itemId: string) => void,
}

export function ContextMenuGroup(props: React.PropsWithChildren<ContextMenuGroupProps>): React.ReactElement {

	return (
		<Menu __onActionInternal={props.__onActionInternal}>
			<SubMenuItem itemId={"new"}>
				<Slot name={"item"}>
					New
				</Slot>
				<Slot name={"menu"}>
					<MenuItem itemId={"new.collection"} onAction={props.onCreateCollection}>Collection</MenuItem>
					<MenuItem itemId={"new.group"} onAction={props.onCreateGroup}>Group</MenuItem>
				</Slot>
			</SubMenuItem>
			<MenuItem itemId={"edit"} disabled={props.groupId === null} onAction={props.onEdit}>Rename</MenuItem>
			<MenuItem itemId={"delete"} disabled={props.groupId === null} onAction={props.onDelete}>Delete</MenuItem>
		</Menu>
	);


}
