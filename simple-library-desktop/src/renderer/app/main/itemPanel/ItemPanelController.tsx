import * as React from 'react';
import { Component } from 'react';
import "./itemPanel.css";
import { ItemPanel } from './ItemPanel';
import {Collection, Group, ItemData} from '../../../../common/commonModels';

export const ITEM_DRAG_GHOST_ID: string = "item-drag-ghost";
export const ITEM_DRAG_GHOST_CLASS: string = "item-drag-ghost";
export const ITEM_COPY_DRAG_GHOST_CLASS: string = "item-copy-drag-ghost";
export const ITEM_MOVE_DRAG_GHOST_CLASS: string = "item-move-drag-ghost";

export enum SelectMode {
    DEFAULT = "default",
    ADD = "add",
    SUB = "sub"
}

interface ItemPanelControllerProps {
    selectedCollectionId: number | undefined,
    rootGroup: Group,
    items: ItemData[],
    onActionMove: (targetCollectionId: number | undefined, itemIds: number[]) => void,
    onActionCopy: (targetCollectionId: number | undefined, itemIds: number[]) => void
}

interface ItemPanelControllerState {
    selectedItemIds: number[]
    lastSelectedItemId: number | undefined,
}

export class ItemPanelController extends Component<ItemPanelControllerProps, ItemPanelControllerState> {

    constructor(props: ItemPanelControllerProps) {
        super(props);
        this.state = {
            selectedItemIds: [],
            lastSelectedItemId: undefined,
        };
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
        this.handleOnSelectItem = this.handleOnSelectItem.bind(this);
        this.handleContextMenuActionMoveTo = this.handleContextMenuActionMoveTo.bind(this);
        this.handleContextMenuActionCopyTo = this.handleContextMenuActionCopyTo.bind(this);
        this.handleContextMenuActionRemove = this.handleContextMenuActionRemove.bind(this);
        this.handleOnDragStart = this.handleOnDragStart.bind(this);
        this.setDataTransfer = this.setDataTransfer.bind(this);
        this.prepareDragImage = this.prepareDragImage.bind(this);
    }

    render() {
        return <ItemPanel rootGroup={this.props.rootGroup}
                          items={this.props.items}
                          selectedItemIds={this.state.selectedItemIds}
                          onSelectItem={this.handleOnSelectItem}
                          onContextMenuActionMove={this.handleContextMenuActionMoveTo}
                          onContextMenuActionCopy={this.handleContextMenuActionCopyTo}
                          onContextMenuActionRemove={this.handleContextMenuActionRemove}
                          onDragStart={this.handleOnDragStart}
        />;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleOnSelectAll);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleOnSelectAll);
    }

    handleOnSelectAll(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === "a") {
            event.preventDefault();
            event.stopPropagation();
            this.setState({
                selectedItemIds: this.props.items.map(i => i.id),
            });
        }
    }

    handleOnSelectItem(itemId: number, selectMode: SelectMode, rangeSelect: boolean): void {
        let nextSelectedIds: number[] = [];
        if (rangeSelect && this.state.lastSelectedItemId) {
            const allItemIds: number[] = this.props.items.map(item => item.id);
            const prevSelectedIndex: number = allItemIds.indexOf(this.state.lastSelectedItemId);
            const nextSelectedIndex: number = allItemIds.indexOf(itemId);
            if (prevSelectedIndex !== -1 && nextSelectedIndex !== -1) {
                const indexStart: number = Math.min(prevSelectedIndex, nextSelectedIndex);
                const indexEnd: number = Math.max(prevSelectedIndex, nextSelectedIndex);
                const idsInRange: number[] = allItemIds.slice(indexStart, indexEnd + 1);
                if (selectMode === SelectMode.DEFAULT) {
                    nextSelectedIds = idsInRange;
                } else {
                    nextSelectedIds = this.state.selectedItemIds;
                    idsInRange
                        .filter(itemId => nextSelectedIds.indexOf(itemId) !== -1)
                        .forEach(itemId => nextSelectedIds.push(itemId));
                }
            }
        } else {
            if (selectMode === SelectMode.DEFAULT) {
                nextSelectedIds = [itemId];
            }
            if (selectMode === SelectMode.ADD) {
                nextSelectedIds = [...this.state.selectedItemIds, itemId];
            }
            if (selectMode === SelectMode.SUB) {
                nextSelectedIds = this.state.selectedItemIds.filter(id => id !== itemId);
            }
        }
        this.setState({
            selectedItemIds: nextSelectedIds,
            lastSelectedItemId: itemId,
        });
    }

    handleContextMenuActionMoveTo(targetCollectionId: number | undefined, triggerItemId: number) {
        if (targetCollectionId !== this.props.selectedCollectionId) {
            const itemIds: number[] = [...this.state.selectedItemIds];
            if (itemIds.indexOf(triggerItemId) === -1) {
                itemIds.push(triggerItemId);
            }
            this.props.onActionMove(targetCollectionId, itemIds);
        }
    }

    handleContextMenuActionCopyTo(targetCollectionId: number | undefined, triggerItemId: number) {
        if (targetCollectionId !== this.props.selectedCollectionId) {
            const itemIds: number[] = [...this.state.selectedItemIds];
            if (itemIds.indexOf(triggerItemId) === -1) {
                itemIds.push(triggerItemId);
            }
            this.props.onActionCopy(targetCollectionId, itemIds);
        }
    }

    handleContextMenuActionRemove(triggerItemId: number) {
        const itemIds: number[] = [...this.state.selectedItemIds];
        if (itemIds.indexOf(triggerItemId) === -1) {
            itemIds.push(triggerItemId);
        }
        this.props.onActionMove(undefined, itemIds); // todo: hacky -> build proper "remove"-message
    }

    handleOnDragStart(triggerItemId: number, event: React.DragEvent): void {
        const itemsIdsToDrag: number[] = [...this.state.selectedItemIds];
        if (itemsIdsToDrag.indexOf(triggerItemId) === -1) {
            itemsIdsToDrag.push(triggerItemId);
        }
        this.setDataTransfer(event, {
            sourceCollectionId: this.props.selectedCollectionId,
            itemIds: itemsIdsToDrag,
        });
    }

    setDataTransfer(event: React.DragEvent, data: any): void {
        const rawData: string = JSON.stringify(data);
        event.dataTransfer.setData("text/plain", rawData);
        event.dataTransfer.setData("application/json", rawData);
        event.dataTransfer.setDragImage(this.prepareDragImage(event.ctrlKey, data.itemIds.length), -10, -10);
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


}
