import * as React from 'react';
import { ItemData } from '../../../../common/commonModels';
import { HBox, VBox } from '../../../components/layout/Box';
import { concatClasses, Size } from '../../../components/common';
import { getSelectionMode, SelectMode } from '../../common/utils';
import "./itemEntry.css";
import { useContextMenu } from 'react-contexify';
import { ITEM_CONTEXT_MENU_ID } from './ItemContextMenu';

interface ItemEntryProps {
    item: ItemData,
    isSelected: boolean,
    onSelectAction: (itemId: number, selectMode: SelectMode) => void;
    onDragStart: (itemId: number, event: React.DragEvent, copyMode: boolean) => void;
}

export function ItemEntry(props: React.PropsWithChildren<ItemEntryProps>): React.ReactElement {

    const { show } = useContextMenu({
        id: ITEM_CONTEXT_MENU_ID,
        props: {
            itemId: props.item.id,
        },
    });

    return (
        <div
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
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

    function itemClassNames() {
        return concatClasses(
            "item",
            (props.isSelected ? "item-selected" : null),
            "with-shadow-0",
        );
    }

    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        props.onSelectAction(props.item.id, getSelectionMode(event));
    }

    function handleContextMenu(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        show(event);
    }

    function handleDragStart(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        props.onDragStart(props.item.id, event, process.platform === "darwin" ? event.metaKey : event.ctrlKey);
    }


}

