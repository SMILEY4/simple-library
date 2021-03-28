import * as React from 'react';
import { Component } from 'react';
import "./itemPanel.css";
import { ItemPanel } from './ItemPanel';
import { Group, ItemData } from '../../../../common/commonModels';
import { DragAndDropItems } from '../../common/dragAndDrop';

export enum SelectMode {
    DEFAULT = "default",
    ADD = "add",
    SUB = "sub"
}

interface ItemPanelControllerProps {
    selectedCollectionId: number | null,
    rootGroup: Group,
    items: ItemData[],
    onActionMove: (targetCollectionId: number | undefined, itemIds: number[]) => void,
    onActionCopy: (targetCollectionId: number | undefined, itemIds: number[]) => void,
    onActionRemove: (itemIds: number[]) => void,
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
    }

    render() {
        return <ItemPanel collectionId={this.props.selectedCollectionId}
                          rootGroup={this.props.rootGroup}
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

    componentDidUpdate(prevProps: Readonly<ItemPanelControllerProps>, prevState: Readonly<ItemPanelControllerState>, snapshot?: any) {
        if(prevProps.selectedCollectionId !== this.props.selectedCollectionId) {
            this.setState({
                selectedItemIds: [],
            });
        }
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

    handleContextMenuActionMoveTo(targetCollectionId: number | null, triggerItemId: number) {
        if (targetCollectionId !== this.props.selectedCollectionId) {
            const itemIds: number[] = [...this.state.selectedItemIds];
            if (itemIds.indexOf(triggerItemId) === -1) {
                itemIds.push(triggerItemId);
            }
            this.props.onActionMove(targetCollectionId, itemIds);
        }
    }

    handleContextMenuActionCopyTo(targetCollectionId: number | null, triggerItemId: number) {
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
        this.props.onActionRemove(itemIds);
    }

    handleOnDragStart(triggerItemId: number, event: React.DragEvent): void {
        const copy: boolean = event.ctrlKey;
        const itemsIdsToDrag: number[] = [...this.state.selectedItemIds];
        if (itemsIdsToDrag.indexOf(triggerItemId) === -1) {
            itemsIdsToDrag.push(triggerItemId);
        }
        DragAndDropItems.setDragData(event.dataTransfer, this.props.selectedCollectionId, itemsIdsToDrag, copy);
        DragAndDropItems.setDragLabel(event.dataTransfer, copy, itemsIdsToDrag.length);
    }

}
