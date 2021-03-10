import * as React from 'react';
import { Item, ItemParams, Menu, Submenu, useContextMenu } from 'react-contexify';
import { Collection } from '../../../../common/commonModels';

export const ITEM_CONTEXT_MENU_ID: string = "contextmenu.item";

interface ItemContextMenuProps {
    collections: Collection[]
    onActionMove: (targetCollectionId: number | undefined, triggerItemId: number) => void
    onActionCopy: (targetCollectionId: number | undefined, triggerItemId: number) => void
}

export function ItemContextMenu(props: React.PropsWithChildren<ItemContextMenuProps>): React.ReactElement {

    return (
        <Menu id={ITEM_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Submenu label={"Move selected to"}>
                {props.collections.map((collection: Collection) => {
                    return <Item onClick={(data: ItemParams) => handleMoveTo(collection, data)}>{collection.name}</Item>;
                })}
            </Submenu>
            <Submenu label={"Copy selected to"}>
                {props.collections.map((collection: Collection) => {
                    return <Item onClick={(data: ItemParams) => handleCopyTo(collection, data)}>{collection.name}</Item>;
                })}
            </Submenu>
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
}