import * as React from 'react';
import { Component } from 'react';
import { ItemEntryData } from '../mainView';
import { VBox } from '../../../components/layout/Box';
import { AlignCross, Size } from '../../../components/common';
import "./itemPanel.css";
import { ItemEntry } from './ItemEntry';
import "react-contexify/dist/ReactContexify.css";
import { ItemContextMenu } from './ItemContextMenu';
import { Collection } from '../../../../common/commonModels';

export const ITEM_DRAG_GHOST_ID: string = "item-drag-ghost";
export const ITEM_DRAG_GHOST_CLASS: string = "item-drag-ghost";
export const ITEM_COPY_DRAG_GHOST_CLASS: string = "item-copy-drag-ghost";
export const ITEM_MOVE_DRAG_GHOST_CLASS: string = "item-move-drag-ghost";

export interface ItemPanelProps {
    collections: Collection[]
    selectedCollectionId: number | undefined
    items: ItemEntryData[],
    onActionMoveItems: (targetCollectionId: number, itemIds: number[]) => void
    onActionCopyItems: (targetCollectionId: number, itemIds: number[]) => void
}

export interface ItemPanelState {
    selectedItemIds: number[]
    lastSelectedItemId: number | undefined,
}

export const ITEM_CONTEXT_MENU_ID = "item-context-menu";

export class ItemPanel extends Component<ItemPanelProps, ItemPanelState> {

    constructor(props: ItemPanelProps) {
        super(props);
        this.state = {
            selectedItemIds: [],
            lastSelectedItemId: undefined,
        };
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.prepareDragImage = this.prepareDragImage.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "a") {
                event.preventDefault();
                event.stopPropagation();
                this.setState({
                    selectedItemIds: this.props.items.map(i => i.id),
                });
            }
        });
    }

    handleItemSelect(item: ItemEntryData, addSubMode: boolean, rangeMode: boolean) {
        let newSelectedIds: number[] = [];
        if (rangeMode && this.state.lastSelectedItemId) {
            const itemIds: number[] = this.props.items.map(item => item.id);
            const lastSelectedIndex: number = itemIds.indexOf(this.state.lastSelectedItemId);
            const selectedIndex: number = itemIds.indexOf(item.id);
            if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
                const indexStart: number = Math.min(lastSelectedIndex, selectedIndex);
                const indexEnd: number = Math.max(lastSelectedIndex, selectedIndex);
                if (addSubMode) {
                    newSelectedIds = [...this.state.selectedItemIds];
                    itemIds.slice(indexStart, indexEnd + 1)
                        .filter(id => newSelectedIds.indexOf(id) === -1)
                        .forEach(id => newSelectedIds.push(id));
                } else {
                    newSelectedIds = itemIds.slice(indexStart, indexEnd + 1);
                }
            }
        } else {
            if (addSubMode) {
                newSelectedIds = this.state.selectedItemIds.indexOf(item.id) === -1
                    ? [...this.state.selectedItemIds, item.id]
                    : this.state.selectedItemIds.filter(id => id !== item.id);
            } else {
                newSelectedIds = [item.id];
            }
        }

        this.setState({
            selectedItemIds: newSelectedIds,
            lastSelectedItemId: item.id,
        });
    }

    handleDragStart(item: ItemEntryData, event: React.DragEvent) {
        let itemsIdsToDrag: number[] = this.state.selectedItemIds;
        if (itemsIdsToDrag.indexOf(item.id) === -1) {
            itemsIdsToDrag = [item.id];
            this.setState({
                selectedItemIds: itemsIdsToDrag,
                lastSelectedItemId: item.id,
            });
        }
        const dropData: any = {
            sourceCollectionId: this.props.selectedCollectionId,
            itemIds: itemsIdsToDrag,
        };
        const data: string = JSON.stringify(dropData);
        event.dataTransfer.setData("text/plain", data);
        event.dataTransfer.setData("application/json", data);
        event.dataTransfer.setDragImage(this.prepareDragImage(event.ctrlKey, itemsIdsToDrag.length), -10, -10);
        event.dataTransfer.effectAllowed = "copyMove";
    }

    prepareDragImage(copyMode: boolean, nItems: number): Element {
        let dragElement: any = document.getElementById(ITEM_DRAG_GHOST_ID);
        if (!dragElement) {
            dragElement = document.createElement("div");
            dragElement.id = ITEM_DRAG_GHOST_ID;
            document.getElementById("root").appendChild(dragElement);
        }
        dragElement.className = ITEM_DRAG_GHOST_CLASS + " " + (copyMode ? ITEM_COPY_DRAG_GHOST_CLASS : ITEM_MOVE_DRAG_GHOST_CLASS);
        if (copyMode) {
            dragElement.innerText = "Copy " + nItems + (nItems === 1 ? " item" : " items");
        } else {
            dragElement.innerText = "Move " + nItems + (nItems === 1 ? " item" : " items");
        }
        return dragElement;
    }

    render() {
        return (
            <div style={{
                maxHeight: "100vh",
                overflow: "auto",
            }}>
                <VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH} className={"item-container"}>
                    {this.props.items.map(item => {
                        return (
                            <ItemEntry
                                item={item}
                                isSelected={this.state.selectedItemIds.indexOf(item.id) !== -1}
                                onSelect={(addSubMode: boolean, rangeMode: boolean) => this.handleItemSelect(item, addSubMode, rangeMode)}
                                onDragStart={(event: React.DragEvent) => this.handleDragStart(item, event)}
                            />
                        );
                    })}
                </VBox>
                <ItemContextMenu
                    collections={this.props.collections}
                    onActionMove={(targetCollectionId: number) => {
                        this.props.onActionMoveItems(targetCollectionId, this.state.selectedItemIds)
                    }}
                    onActionCopy={(targetCollectionId: number) => {
                        this.props.onActionCopyItems(targetCollectionId, this.state.selectedItemIds)
                    }}
                />
            </div>
        );
    }

}
