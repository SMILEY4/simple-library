import * as React from 'react';
import {Item, ItemParams, Menu, Submenu, useContextMenu} from 'react-contexify';
import {Collection, extractCollections, Group} from '../../../../common/commonModels';

export const ITEM_CONTEXT_MENU_ID: string = "contextmenu.item";

interface ItemContextMenuProps {
    rootGroup: Group,
    onActionMove: (targetCollectionId: number | undefined, triggerItemId: number) => void,
    onActionCopy: (targetCollectionId: number | undefined, triggerItemId: number) => void,
    onActionRemove: (triggerItemId: number) => void;
}

export function ItemContextMenu(props: React.PropsWithChildren<ItemContextMenuProps>): React.ReactElement {

    return (
        <Menu id={ITEM_CONTEXT_MENU_ID}
              onShown={handleOnShow}
              onHidden={handleOnHidden}>
            <Submenu label={"Move selected to"}>
                {props.rootGroup && (
                    [
                        ...props.rootGroup.collections.map((collection: Collection) => {
                            return (
                                <Item onClick={(data: ItemParams) => handleMoveTo(collection, data)}
                                      key={"move." + collection.id}>{collection.name}
                                </Item>
                            );
                        }),
                        ...props.rootGroup.children.map((child: Group) => groupToMoveMenuEntry(child))
                    ]
                )}
            </Submenu>
            <Submenu label={"Copy selected to"}>
                {props.rootGroup && (
                    [
                        ...props.rootGroup.collections.map((collection: Collection) => {
                            return (
                                <Item onClick={(data: ItemParams) => handleCopyTo(collection, data)}
                                      key={"copy." + collection.id}>{collection.name}
                                </Item>
                            );
                        }),
                        ...props.rootGroup.children.map((child: Group) => groupToCopyMenuEntry(child))
                    ]
                )}
            </Submenu>
            <Item onClick={handleRemove}>Remove selected</Item>
        </Menu>
    );

    function groupToMoveMenuEntry(group: Group): React.ReactElement {
        return (
            <Submenu label={group.name}>
                {[
                    ...group.collections.map((collection: Collection) => {
                        return (
                            <Item onClick={(data: ItemParams) => handleMoveTo(collection, data)}
                                  key={"move." + collection.id}>{collection.name}
                            </Item>
                        );
                    }),
                    ...group.children.map((child: Group) => groupToMoveMenuEntry(child))
                ]}
            </Submenu>
        );
    }

    function groupToCopyMenuEntry(group: Group): React.ReactElement {
        return (
            <Submenu label={group.name}>
                {[
                    ...group.collections.map((collection: Collection) => {
                        return (
                            <Item onClick={(data: ItemParams) => handleCopyTo(collection, data)}
                                  key={"copy." + collection.id}>{collection.name}
                            </Item>
                        );
                    }),
                    ...group.children.map((child: Group) => groupToCopyMenuEntry(child))
                ]}
            </Submenu>
        );
    }

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
            const {hideAll} = useContextMenu({
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
