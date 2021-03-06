import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Item } from '../mainView';
import { HBox, VBox } from '../../../components/layout/Box';
import { AlignCross, concatClasses, Size } from '../../../components/common';
import "./itemPanel.css";

export interface ItemPanelProps {
    selectedCollectionId: number | undefined
    items: Item[],
}

export interface ItemPanelState {
    selectedItemIds: number[]
    lastSelectedItemId: number | undefined,
}

export class ItemPanel extends Component<ItemPanelProps, ItemPanelState> {

    constructor(props: ItemPanelProps) {
        super(props);
        this.state = {
            selectedItemIds: [],
            lastSelectedItemId: undefined,
        };
        this.renderItem = this.renderItem.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
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

    handleItemSelect(item: Item, addSubMode: boolean, rangeMode: boolean) {
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

    handleDragStart(item: Item, event: React.DragEvent) {
        let itemsIdsToDrag: number[] = this.state.selectedItemIds;
        if (itemsIdsToDrag.indexOf(item.id) === -1) {
            itemsIdsToDrag = [item.id]
            this.setState({
                selectedItemIds: itemsIdsToDrag,
                lastSelectedItemId: item.id,
            });
        }
        const dropData: any = {
            sourceCollectionId: this.props.selectedCollectionId,
            itemIds: itemsIdsToDrag,
        }
        event.dataTransfer.setData("text/plain", JSON.stringify(dropData));
        event.dataTransfer.setData("application/json", JSON.stringify(dropData));
        event.dataTransfer.effectAllowed = "move";
    }

    render() {
        return (
            <div style={{
                maxHeight: "100vh",
                overflow: "auto",
            }}>
                <VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH} className={"item-container"}>
                    {
                        this.props.items
                            .map(item => this.renderItem(
                                item,
                                this.state.selectedItemIds.indexOf(item.id) !== -1,
                                (shiftDown, ctrlDown) => this.handleItemSelect(item, ctrlDown, shiftDown),
                                (event: React.DragEvent) => this.handleDragStart(item, event)),
                            )
                    }
                </VBox>
            </div>
        );
    }

    renderItem(item: Item,
               isSelected: boolean,
               onSelect: (shiftDown: boolean, ctrlDown: boolean) => void,
               onStartDrag: (event: React.DragEvent) => void): ReactElement {

        function itemClassNames() {
            return concatClasses(
                "item",
                (isSelected ? "item-selected" : null),
                "with-shadow-0",
            );
        }

        return (
            <div
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    onSelect(event.shiftKey, event.ctrlKey);
                }}
                onDragStart={(event) => {
                    onStartDrag(event);
                }}
                draggable={true}
            >
                <HBox withBorder
                      spacing={Size.S_0}
                      className={itemClassNames()}
                >
                    <img src={item.thumbnail} alt='img' draggable={false} />
                    <VBox padding={Size.S_1} spacing={Size.S_0_5}>
                        <li>{item.id}</li>
                        <li>{item.filepath}</li>
                        <li>{item.timestamp}</li>
                        <li>{item.hash}</li>
                        {item.collection && <li>{item.collection}</li>}
                    </VBox>
                </HBox>
            </div>
        );
    }

}
