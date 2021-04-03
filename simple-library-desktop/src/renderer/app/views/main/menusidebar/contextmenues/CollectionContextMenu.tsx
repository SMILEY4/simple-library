import * as React from 'react';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';
import { Group } from '../../../../../../common/commonModels';
import { contextMenuGroupTree } from '../../../../common/contextMenuTree';

export const COLLECTION_CONTEXT_MENU_ID: string = "contextmenu.collection";

interface CollectionContextMenuProps {
    rootGroup: Group,
    onActionEdit: (collectionId: number) => void
    onActionDelete: (collectionId: number) => void
    onActionMove: (collectionId: number, targetGroupId: number) => void
}

export function CollectionContextMenu(props: React.PropsWithChildren<CollectionContextMenuProps>): React.ReactElement {

    return (
        <Menu id={COLLECTION_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Item onClick={handleEdit}>Edit Collection</Item>
            <Item onClick={handleDelete}>Delete Collection</Item>
            {contextMenuGroupTree(props.rootGroup, "Move", true, handleMoveTo, false)}
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
                id: COLLECTION_CONTEXT_MENU_ID,
            });
            hideAll();
        }
    }

    function handleEdit(data: ItemParams): void {
        props.onActionEdit(data.props.collectionId);
    }

    function handleDelete(data: ItemParams): void {
        props.onActionDelete(data.props.collectionId);
    }

    function handleMoveTo(targetGroup: Group, data: ItemParams): void {
        props.onActionMove(data.props.collectionId, targetGroup.id);
    }

}