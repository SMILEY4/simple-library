import * as React from "react";
import {Component, ReactElement} from "react";
import {Button} from "_renderer/components/buttons/Buttons";
import {HighlightType, StyleType} from "_renderer/components/Common";
import {BsChevronDown, BsChevronUp, IoCheckmark} from "react-icons/all";
import "./choiceBox.css"

// https://blog.logrocket.com/building-a-custom-dropdown-menu-component-for-react-e94f02ced4a1/
// https://tailwindui.com/components/application-ui/forms/select-menus

/*
TODO:
- multiselect
- define max number of visible items -> scroll if more than that
- allow more complex items -> icons, images, secondary text ...
- label above checkbox (see inputfield)
- control initially selected item
- styles (filled, ghost, text)
 */

interface ListItemType {
    id: string,
    title: string,
}


interface ChoiceBoxProps {

    style: StyleType,
    highlight?: HighlightType,
    bg?: string,

    title: string,
    items: string[],

    multiselect?: boolean,
    autoWidth?: boolean
}


interface ChoiceBoxState {
    title: string,
    isListOpen: boolean
    items: ListItemType[],
    itemSelected: ListItemType | undefined
}


export class ChoiceBox extends Component<ChoiceBoxProps, ChoiceBoxState> {

    constructor(props: ChoiceBoxProps) {
        super(props);
        this.state = {
            title: this.props.title,
            isListOpen: false,
            items: this.props.items.map((item, index) => {
                return {
                    id: String(index),
                    title: item,
                }
            }),
            itemSelected: undefined
        };
        this.closeList = this.closeList.bind(this)
        this.toggleList = this.toggleList.bind(this)
        this.onItemClicked = this.onItemClicked.bind(this)
        this.renderTitleDummies = this.renderTitleDummies.bind(this)
        this.renderButton = this.renderButton.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.renderItemList = this.renderItemList.bind(this)
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


    onItemClicked(item: ListItemType) {
        this.setState({
            itemSelected: item,
            isListOpen: false
        })
    }


    renderTitleDummies() {
        // add all possible values to the button text width height=0 (so they are invisible)
        // -> button is wide enough for every possible value
        const {items} = this.state
        return (
            <>
                <div className={"choice-box-title-dummy"}>{this.props.title}</div>
                {items.map(item => <div className={"choice-box-title-dummy"}>{item.title}</div>)}
            </>
        )
    }


    renderButton() {
        const {isListOpen, title, itemSelected} = this.state
        const currentTitle = itemSelected ? itemSelected.title : title
        return (
            <Button style={this.props.style} highlight={this.props.highlight} bg={this.props.bg} onClick={this.toggleList}>
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


    renderItem(item: ListItemType): ReactElement {
        return (
            <div className={"choice-box-item"} onClick={() => this.onItemClicked(item)}>
                <div className={"choice-box-item-content"}>
                    {item.title}
                </div>
                {
                    this.state.itemSelected === item
                        ? <IoCheckmark className={"choice-box-item-selected-icon"}/>
                        : null
                }
            </div>
        )
    }


    renderItemList(): ReactElement {
        const {items} = this.state
        return (
            <div className={"choice-box-list with-shadow-0"}>
                {items.map(item => this.renderItem(item))}
            </div>
        )
    }


    render() {
        const {isListOpen} = this.state
        return (
            <div className={"choice-box-wrapper"}>
                {this.renderButton()}
                {isListOpen && this.renderItemList()}
            </div>
        )
    }

}