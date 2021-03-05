import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Item } from '../mainView';
import { HBox, VBox } from '../../../components/layout/Box';
import { AlignCross, Size } from '../../../components/common';


export interface ItemPanelProps {
    selectedCollectionId: number | undefined
    items: Item[],
}

export interface ItemPanelState {
}

export class ItemPanel extends Component<ItemPanelProps, ItemPanelState> {

    constructor(props: ItemPanelProps) {
        super(props);
        this.state = {};
        this.renderItem = this.renderItem.bind(this);
    }


    render() {
        return (
            <div style={{
                maxHeight: "100vh",
                overflow: "auto",
            }}>
                <VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH}>
                    {this.props.items.map(item => this.renderItem(item))}
                </VBox>
            </div>
        );
    }

    renderItem(item: Item): ReactElement {
        return (
            <HBox withBorder spacing={Size.S_0} className={"with-shadow-0"} style={{ backgroundColor: "var(--background-color-1)" }}>
                <img src={item.thumbnail} alt='img' />
                <VBox padding={Size.S_1} spacing={Size.S_0_5}>
                    <li>{item.filepath}</li>
                    <li>{item.timestamp}</li>
                    <li>{item.hash}</li>
                    {item.collection && <li>{item.collection}</li>}
                </VBox>
            </HBox>
        );
    }

}
