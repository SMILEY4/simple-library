import * as React from 'react';
import { Item, Menu, Submenu } from 'react-contexify';
import { ITEM_CONTEXT_MENU_ID } from './itemPanel';
import { Collection } from '../../../../common/commonModels';

interface ItemContextMenuProps {
    collections: Collection[]
    onActionMove: (targetCollectionId: number) => void
    onActionCopy: (targetCollectionId: number) => void
}

export function ItemContextMenu(props: React.PropsWithChildren<ItemContextMenuProps>): React.ReactElement {
    return (
        <Menu id={ITEM_CONTEXT_MENU_ID}>
            <Submenu label={"Move selected to"}>
                {props.collections.map((collection: Collection) => {
                    return <Item onClick={() => props.onActionMove(collection.id)}>{collection.name}</Item>;
                })}
            </Submenu>
            <Submenu label={"Copy selected to"}>
                {props.collections.map((collection: Collection) => {
                    return <Item onClick={() => props.onActionCopy(collection.id)}>{collection.name}</Item>;
                })}
            </Submenu>
        </Menu>
    );
}
