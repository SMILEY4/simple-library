import React from "react";
import {Menu} from "../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../components/menu/menuitem/MenuItem";

interface MetadataListEntryContextMenuProps {
	attributeName: string,
	attributeId: number,
	onCopy: (attributeId: number) => void,
	onDelete: (attributeId: number) => void,
	onHide: (attributeId: number) => void,
	__onActionInternal?: (itemId: string) => void,
}

export function MetadataListEntryContextMenu(props: React.PropsWithChildren<MetadataListEntryContextMenuProps>): React.ReactElement {
	return (
		<Menu __onActionInternal={props.__onActionInternal} title={props.attributeName}>
			<MenuItem itemId={"copy"} onAction={() => props.onCopy(props.attributeId)}>Copy Value</MenuItem>
			<MenuItem itemId={"hide"} onAction={() => props.onHide(props.attributeId)}>Hide Attribute</MenuItem>
			<MenuItem itemId={"delete"} onAction={() => props.onDelete(props.attributeId)}>Delete Entry</MenuItem>
		</Menu>
	);
}
