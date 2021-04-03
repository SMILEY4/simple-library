import * as React from 'react';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';
import { Collection, CollectionType, Group } from '../../../../common/commonModels';
import { contextMenuTree } from '../../../common/contextMenuTree';

export const ITEM_CONTEXT_MENU_ID: string = "contextmenu.item";

interface ItemContextMenuProps {
    collectionId: number | null,
    rootGroup: Group,
    onActionMove: (targetCollectionId: number, triggerItemId: number) => void,
    onActionCopy: (targetCollectionId: number, triggerItemId: number) => void,
    onActionRemove: (triggerItemId: number) => void;
}

export function ItemContextMenu(props: React.PropsWithChildren<ItemContextMenuProps>): React.ReactElement {

    return (
        <Menu id={ITEM_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            {contextMenuTree(props.rootGroup, "Move selected to", handleMoveTo, filterCollections)}
            {contextMenuTree(props.rootGroup, "Copy selected to", handleCopyTo, filterCollections)}
            <Item onClick={handleRemove}>Remove selected</Item>
        </Menu>
    );

    function filterCollections(collection: Collection): boolean {
        return collection.id !== props.collectionId && collection.type !== CollectionType.SMART;
    }

    function handleOnShow(): void {
        document.addEventListener('mousedown', hideOnClickOutside);
    }

    function handleOnHidden(): void {
        document.removeEventListener('mousedown', hideOnClickOutside);
    }

    function hideOnClickOutside(event: any): void {
        const elementContextMenu = document.getElementsByClassName("react-contexify")[0];
        const eventTarget = event.target;
        if (elementContextMenu && elementContextMenu !== eventTarget && !elementContextMenu.contains(eventTarget)) {
            const { hideAll } = useContextMenu({
                id: ITEM_CONTEXT_MENU_ID,
            });
            hideAll();
        }
    }

    function handleMoveTo(targetCollection: Collection, data: ItemParams): void {
        props.onActionMove(targetCollection.id, data.props.itemId);
    }

    function handleCopyTo(targetCollection: Collection, data: ItemParams): void {
        props.onActionCopy(targetCollection.id, data.props.itemId);
    }

    function handleRemove(data: ItemParams) {
        props.onActionRemove(data.props.itemId);
    }

}
