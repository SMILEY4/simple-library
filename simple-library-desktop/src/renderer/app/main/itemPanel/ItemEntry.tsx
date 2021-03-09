import * as React from 'react';
import { HBox, VBox } from '../../../components/layout/Box';
import { concatClasses, Size } from '../../../components/common';
import { ItemEntryData } from '../mainView';
import { useContextMenu } from 'react-contexify';
import { ITEM_CONTEXT_MENU_ID } from './itemPanel';

interface ItemEntryProps {
    item: ItemEntryData,
    isSelected: boolean,
    onSelect: (addSubMode: boolean, rangeMode: boolean) => void,
    onDragStart: (event: React.DragEvent) => void
}

export function ItemEntry(props: React.PropsWithChildren<ItemEntryProps>): React.ReactElement {

    function getClassNames() {
        return concatClasses(
            "item",
            (props.isSelected ? "item-selected" : null),
            "with-shadow-0",
        );
    }

    const { show } = useContextMenu({
        id: ITEM_CONTEXT_MENU_ID,
    });

    return (
        <div
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                props.onSelect(event.ctrlKey, event.shiftKey);
            }}
            onContextMenu={(event: React.MouseEvent) => {
                props.onSelect(true, false);
                show(event);
            }}
            onDragStart={(event) => props.onDragStart(event)}
            draggable={true}
        >
            <HBox withBorder
                  spacing={Size.S_0}
                  className={getClassNames()}
            >
                <img src={props.item.thumbnail} alt='img' draggable={false} />
                <VBox padding={Size.S_1} spacing={Size.S_0_5}>
                    <li>{props.item.id}</li>
                    <li>{props.item.filepath}</li>
                    <li>{props.item.timestamp}</li>
                    <li>{props.item.hash}</li>
                    {props.item.collection && <li>{props.item.collection}</li>}
                </VBox>
            </HBox>
        </div>
    );
}