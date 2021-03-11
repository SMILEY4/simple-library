import * as React from 'react';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';

export const COLLECTION_CONTEXT_MENU_ID: string = "contextmenu.collection";

interface CollectionContextMenuProps {
    onActionRename: (collectionId: number) => void
    onActionDelete: (collectionId: number) => void
}

export function CollectionContextMenu(props: React.PropsWithChildren<CollectionContextMenuProps>): React.ReactElement {

    return (
        <Menu id={COLLECTION_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Item onClick={handleRename}>Rename Collection</Item>
            <Item onClick={handleDelete}>Delete Collection</Item>
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

    function handleRename(data: ItemParams) {
        props.onActionRename(data.props.collectionId);
    }

    function handleDelete(data: ItemParams) {
        props.onActionDelete(data.props.collectionId);
    }

}