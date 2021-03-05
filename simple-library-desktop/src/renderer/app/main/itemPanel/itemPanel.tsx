import * as React from 'react';
import { Component } from 'react';
import { Item } from '../mainView';


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
    }


    render() {
        return (
            <div style={{
                maxHeight: "100vh",
                overflow: "auto",
            }}>
                <table>
                    <tbody>
                    {this.props.items.map(item => {
                        return (
                            <tr>
                                <td style={{ border: "1px solid black" }}>
                                    <img src={item.thumbnail} alt='img' />
                                </td>
                                <td style={{ border: "1px solid black" }}>{item.filepath}</td>
                                <td style={{ border: "1px solid black" }}>{item.collection}</td>
                                <td style={{ border: "1px solid black" }}>{item.timestamp}</td>
                                <td style={{ border: "1px solid black" }}>{item.hash}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

}
