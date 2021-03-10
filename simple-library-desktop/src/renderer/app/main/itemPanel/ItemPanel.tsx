import * as React from 'react';
import { HBox, VBox } from '../../../components/layout/Box';
import { AlignCross, concatClasses, Size } from '../../../components/common';
import { Collection, ItemData } from '../../../../common/commonModels';
import { SelectMode } from './ItemPanelController';
import { ITEM_CONTEXT_MENU_ID, ItemContextMenu } from './ItemContextMenu';
import { useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

interface ItemPanelProps {
    collections: Collection[],
    items: ItemData[],
    selectedItemIds: number[],
    onSelectItem: (itemId: number, selectMode: SelectMode, rangeSelect: boolean) => void,
    onDragStart: (itemId: number, event: React.DragEvent) => void,
    onContextMenuActionMove: (targetCollectionId: number | undefined, triggerItemId: number) => void,
    onContextMenuActionCopy: (targetCollectionId: number | undefined, triggerItemId: number) => void,
    onContextMenuActionRemove: (triggerItemId: number) => void;
}

export function ItemPanel(props: React.PropsWithChildren<ItemPanelProps>): React.ReactElement {
    return (
        <div style={{
            maxHeight: "100vh",
            overflow: "auto",
        }}>
            <VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH} className={"item-container"}>
                {
                    props.items.map((item: ItemData) => {
                        return <Item item={item}
                                     key={item.id}
                                     isSelected={props.selectedItemIds.indexOf(item.id) !== -1}
                                     onSelection={(selectMode: SelectMode, rangeSelect: boolean) => props.onSelectItem(item.id, selectMode, rangeSelect)}
                                     onDragStart={(event: React.DragEvent) => props.onDragStart(item.id, event)}
                        />;
                    })
                }
            </VBox>
            <ItemContextMenu
                collections={props.collections}
                onActionMove={props.onContextMenuActionMove}
                onActionCopy={props.onContextMenuActionCopy}
                onActionRemove={props.onContextMenuActionRemove}
            />
        </div>
    );
}


interface ItemProps {
    item: ItemData,
    isSelected: boolean,
    onSelection: (selectMode: SelectMode, rangeSelect: boolean) => void;
    onDragStart: (event: React.DragEvent) => void;
}

function Item(props: React.PropsWithChildren<ItemProps>): React.ReactElement {

    const { show } = useContextMenu({
        id: ITEM_CONTEXT_MENU_ID,
        props: {
            itemId: props.item.id,
        },
    });

    function itemClassNames() {
        return concatClasses(
            "item",
            (props.isSelected ? "item-selected" : null),
            "with-shadow-0",
        );
    }

    function getSelectMode(event: React.MouseEvent, isSelected: boolean): SelectMode {
        let selectMode: SelectMode;
        if (event.ctrlKey) {
            selectMode = isSelected ? SelectMode.SUB : SelectMode.ADD;
        } else {
            selectMode = SelectMode.DEFAULT;
        }
        return selectMode;
    }

    return (
        <div
            onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                props.onSelection(getSelectMode(event, props.isSelected), event.shiftKey);
            }}
            onContextMenu={(event: React.MouseEvent) => {
                event.preventDefault();
                if (!props.isSelected) {
                    props.onSelection(SelectMode.DEFAULT, false);
                }
                show(event);
            }}
            onDragStart={(event: React.DragEvent) => {
                if (!props.isSelected) {
                    props.onSelection(SelectMode.DEFAULT, false);
                }
                props.onDragStart(event);
            }}
            draggable={true}
        >
            <HBox withBorder
                  spacing={Size.S_0}
                  className={itemClassNames()}
            >
                <img src={props.item.thumbnail} alt='img' draggable={false} />
                <VBox padding={Size.S_1} spacing={Size.S_0_5}>
                    <li>{props.item.id}</li>
                    <li>{props.item.filepath}</li>
                    <li>{props.item.timestamp}</li>
                    <li>{props.item.hash}</li>
                </VBox>
            </HBox>
        </div>
    );
}