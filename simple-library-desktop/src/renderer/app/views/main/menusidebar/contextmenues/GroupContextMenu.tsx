import * as React from 'react';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';
import { Group } from '../../../../../../common/commonModels';
import { contextMenuGroupTree } from '../../../../common/contextMenuTree';

export const GROUP_CONTEXT_MENU_ID: string = "contextmenu.group";

interface GroupContextMenuProps {
    rootGroup: Group,
    onActionRename: (groupId: number) => void
    onActionDelete: (groupId: number) => void
    onActionCreateCollection: (triggerGroupId: number) => void,
    onActionCreateGroup: (triggerGroupId: number) => void,
    onActionMove: (groupId: number, targetGroupId: number) => void
}

export function GroupContextMenu(props: React.PropsWithChildren<GroupContextMenuProps>): React.ReactElement {

    return (
        <Menu id={GROUP_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Item onClick={handleRename}>Rename Group</Item>
            <Item onClick={handleDelete}>Delete Group</Item>
            <Item onClick={handleCreateCollection}>Create Collection</Item>
            <Item onClick={handleCreateGroup}>Create Group</Item>
            {contextMenuGroupTree(props.rootGroup, "Move", true, handleMoveTo)}
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

    function handleCreateCollection(data: ItemParams) {
        props.onActionCreateCollection(data.props.groupId);
    }

    function handleCreateGroup(data: ItemParams) {
        props.onActionCreateGroup(data.props.groupId);
    }

    function handleMoveTo(targetGroup: Group, data: ItemParams): void {
        props.onActionMove(data.props.groupId, targetGroup.id);
    }

}