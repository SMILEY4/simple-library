import React from "react";
import {Menu} from "../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../components/menu/menuitem/MenuItem";
import {AttributeKeyDTO} from "../../../../../../common/events/dtoModels";

interface MetadataListEntryContextMenuProps {
	attributeKey: AttributeKeyDTO,
	onCopy: (attributeKey: AttributeKeyDTO) => void,
	onDelete: (attributeKey: AttributeKeyDTO) => void,
	__onActionInternal?: (itemId: string) => void,
}

export function MetadataListEntryContextMenu(props: React.PropsWithChildren<MetadataListEntryContextMenuProps>): React.ReactElement {

	return (
		<Menu __onActionInternal={props.__onActionInternal}>
			<MenuItem itemId={"copy"} onAction={() => props.onCopy(props.attributeKey)}>Copy Value</MenuItem>
			<MenuItem itemId={"delete"} onAction={() => props.onDelete(props.attributeKey)}>Delete Entry</MenuItem>
		</Menu>
	);
}
