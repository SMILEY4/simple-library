import * as React from 'react';
import { HBox, VBox } from '../../../components/layout/Box';
import { AlignCross, concatClasses, Size } from '../../../components/common';
import { ItemData } from '../../../../common/commonModels';
import { SelectMode } from './ItemPanelController';

interface ItemPanelProps {
    items: ItemData[],
    selectedItemIds: number[],
    onSelectItem: (itemId: number, selectMode: SelectMode, rangeSelect: boolean) => void,
    onDragStart: (itemId: number, event: React.DragEvent) => void
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
                                     isSelected={props.selectedItemIds.indexOf(item.id) !== -1}
                                     onSelection={(selectMode: SelectMode, rangeSelect: boolean) => props.onSelectItem(item.id, selectMode, rangeSelect)}
                                     onDragStart={(event: React.DragEvent) => props.onDragStart(item.id, event)}
                        />;
                    })
                }
            </VBox>
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
            onDragStart={props.onDragStart}
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