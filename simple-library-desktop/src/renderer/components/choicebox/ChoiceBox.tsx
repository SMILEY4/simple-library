import * as React from "react";
import {Component, ReactElement} from "react";
import {Button} from "_renderer/components/buttons/Buttons";
import {HighlightType, StyleType} from "_renderer/components/Common";
import {BsChevronDown, BsChevronUp} from "react-icons/all";
import "./choiceBox.css"

// https://blog.logrocket.com/building-a-custom-dropdown-menu-component-for-react-e94f02ced4a1/
// https://tailwindui.com/components/application-ui/forms/select-menus

/*
TODO:
- multiselect
- show checkmarks next to selected item(s)
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

export enum CheckmarkPosition {
    NONE = "none",
    LEFT = "left",
    RIGHT = "right"
}

interface ChoiceBoxProps {

    style: StyleType,
    highlight?: HighlightType,
    bg?: string,

    title: string,
    items: string[],

    multiselect?: boolean, // todo
    checkmarkPosition?: CheckmarkPosition  // todo
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
        this.renderButton = this.renderButton.bind(this)
        this.renderListItem = this.renderListItem.bind(this)
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


    renderButton() {
        const {isListOpen, title, itemSelected} = this.state
        const currentTitle = itemSelected ? itemSelected.title : title
        return (
            <Button style={this.props.style} highlight={this.props.highlight} bg={this.props.bg} onClick={this.toggleList}>
                {currentTitle}
                {
                    isListOpen
                        ? <BsChevronUp/>
                        : <BsChevronDown/>
                }
            </Button>
        )
    }


    renderListItem(item: ListItemType): ReactElement {
        return (
            <div className={"choice-box-item"} onClick={() => this.onItemClicked(item)}>
                {item.title}
            </div>
        )
    }


    render() {
        const {isListOpen, items} = this.state
        return (
            <div className={"choice-box-wrapper"}>
                {this.renderButton()}
                {isListOpen && (
                    <div className={"choice-box-list with-shadow-0"}>
                        {items.map(item => this.renderListItem(item))}
                    </div>
                )}

            </div>
        )
    }

}