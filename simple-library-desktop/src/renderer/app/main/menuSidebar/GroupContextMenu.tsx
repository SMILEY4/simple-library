import * as React from 'react';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';

export const GROUP_CONTEXT_MENU_ID: string = "contextmenu.group";

interface GroupContextMenuProps {
    onActionRename: (groupId: number) => void
    onActionDelete: (groupId: number) => void
}

export function GroupContextMenu(props: React.PropsWithChildren<GroupContextMenuProps>): React.ReactElement {

    return (
        <Menu id={GROUP_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Item onClick={handleRename}>Rename Group</Item>
            <Item onClick={handleDelete}>Delete Group</Item>
        </Menu>
    );

    function handleOnShow(): void {
        document.addEventListener('mousedown', handleOnMousedown);
    }

    function handleOnHidden(): void {
        document.removeEventListener('mousedown', handleOnMousedown);
    }

    function handleOnMousedown(event: any): void {
        const elementContextMenu = document.getElementsByClassName("react-contexify ")[0];
        const eventTarget = event.target;
        if (elementContextMenu && elementContextMenu !== eventTarget && !elementContextMenu.contains(eventTarget)) {
            const { hideAll } = useContextMenu({
                id: GROUP_CONTEXT_MENU_ID,
            });
            hideAll();
        }
    }

    function handleRename(data: ItemParams) {
        props.onActionRename(data.props.groupId);
    }

    function handleDelete(data: ItemParams) {
        props.onActionDelete(data.props.groupId);
    }

}