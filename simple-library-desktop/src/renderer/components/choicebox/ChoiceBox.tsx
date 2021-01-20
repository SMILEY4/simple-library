import * as React from "react";
import {Component, ReactElement} from "react";
import {BsChevronDown, BsChevronUp, IoCheckmark} from "react-icons/all";
import "./choiceBox.css"
import { HighlightType, StyleType } from '../common';
import { Button } from '../buttons/Buttons';

interface ExtendedPropListItemType {
    id: string,
    content: any,
}

type PropListItemType = string | ExtendedPropListItemType

interface ChoiceBoxProps {
    style: StyleType,
    highlight?: HighlightType,

    title: string,
    items: PropListItemType[],
    initiallySelected?: string,

    label?: string,

    autoWidth?: boolean,
    listHeight?: number

    onSelect?: (value: string) => void
}

interface StateListItemType {
    id: string,
    content: any,
    usesPropId: boolean
}

interface ChoiceBoxState {
    title: string,
    isListOpen: boolean
    items: StateListItemType[],
    itemSelectedId: string | undefined
}


export class ChoiceBox extends Component<ChoiceBoxProps, ChoiceBoxState> {

    constructor(props: ChoiceBoxProps) {
        super(props);
        this.state = {
            title: this.props.title,
            isListOpen: false,
            items: this.toStateItems(this.props.items),
            itemSelectedId: this.props.initiallySelected ? props.initiallySelected : undefined
        };
        this.toStateItems = this.toStateItems.bind(this)
        this.getItemById = this.getItemById.bind(this)
        this.closeList = this.closeList.bind(this)
        this.toggleList = this.toggleList.bind(this)
        this.onItemClicked = this.onItemClicked.bind(this)
        this.renderTitleDummies = this.renderTitleDummies.bind(this)
        this.renderButton = this.renderButton.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.renderSeparator = this.renderSeparator.bind(this)
        this.renderItemList = this.renderItemList.bind(this)
    }

    toStateItems(items: PropListItemType[]): StateListItemType[] {
        return items.map((item, index) => {
            if (typeof item === 'string') {
                return {
                    id: index.toString(),
                    content: item.toString(),
                    usesPropId: false
                } as StateListItemType
            } else {
                return {
                    id: item.id,
                    content: item.content,
                    usesPropId: true
                } as StateListItemType
            }
        })
    }

    componentWillReceiveProps(newProps: ChoiceBoxProps) {
        if (newProps.initiallySelected && newProps.initiallySelected !== this.props.initiallySelected) {
            this.setState({
                itemSelectedId: newProps.initiallySelected
            })
        }
    }

    componentDidUpdate() {
        const {isListOpen} = this.state;
        setTimeout(() => {
            if (isListOpen) {
                window.addEventListener('click', this.closeList)
            } else {
                window.removeEventListener('click', this.closeList)
            }
        }, 0)
    }

    getItemById(itemId: string | undefined): StateListItemType | undefined {
        if (itemId) {
            return this.state.items.find(item => item.id === itemId)
        } else {
            return undefined
        }
    }

    closeList() {
        this.setState({
            isListOpen: false
        })
    }


    toggleList() {
        this.setState({
            isListOpen: !this.state.isListOpen
        })
    }


    onItemClicked(item: StateListItemType) {
        if (item.id !== this.state.itemSelectedId) {
            this.setState({
                itemSelectedId: item.id,
                isListOpen: false
            })
            if (this.props.onSelect) {
                this.props.onSelect(item.usesPropId ? item.id : item.content)
            }
        }
    }


    renderTitleDummies() {
        // add all possible values to the button text width height=0 (so they are invisible)
        // -> button is wide enough for every possible value
        const {items} = this.state
        return (
            <>
                <div className={"choice-box-title-dummy"}>{this.props.title}</div>
                {items.map(item => <div className={"choice-box-title-dummy"}>{item.content}</div>)}
            </>
        )
    }


    renderButton() {
        const {isListOpen, title, itemSelectedId} = this.state
        const currentItem = this.getItemById(itemSelectedId)
        const currentTitle = currentItem ? currentItem.content : title
        return (
            <Button style={this.props.style} highlight={this.props.highlight} onClick={this.toggleList}>
                <div className={"choice-box-title"}>
                    {currentTitle}
                    {this.props.autoWidth !== false && this.renderTitleDummies()}
                </div>
                {
                    isListOpen
                        ? <BsChevronUp/>
                        : <BsChevronDown/>
                }
            </Button>
        )
    }


    renderItem(item: StateListItemType): ReactElement {
        return (
            <div className={"choice-box-item"} onClick={() => this.onItemClicked(item)}>
                <div className={"choice-box-item-content"}>
                    {item.content}
                </div>
                {
                    this.state.itemSelectedId === item.id
                        ? <IoCheckmark className={"choice-box-item-selected-icon"}/>
                        : null
                }
            </div>
        )
    }


    renderSeparator(): ReactElement {
        return <div className={"choice-box-separator"}/>
    }


    renderItemList(): ReactElement {
        const {items} = this.state
        return (
            <div className={"choice-box-list with-shadow-1"}
                 style={this.props.listHeight ? {maxHeight: this.props.listHeight + 'em'} : {}}
            >
                {items.map(item => this.renderItem(item))}
            </div>
        )
    }


    render() {
        const {isListOpen} = this.state
        return (
            <div className={"choice-box-wrapper"}>
                {this.props.label ? this.props.label : null}
                {this.renderButton()}
                {isListOpen && this.renderItemList()}
            </div>
        )
    }

}