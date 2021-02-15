import * as React from 'react';
import {Component, ReactElement} from 'react';
import {AlignCross, AlignMain, concatClasses, Size, Variant} from "../common";
import {Button} from "../button/Button";
import {AiOutlineCheck, BsChevronDown} from "react-icons/all";
import "./choicebox.css"
import {VBox} from "../layout/Box";
import {Dropdown} from "./Dropdown";

export interface ChoiceBoxProps {
    variant: Variant,
    items: string[],
    itemFilter?: (item: string) => boolean,
    selected: string,
    onSelect?: (item: string) => void
    maxVisibleItems?: number,
    autoWidth?: boolean,
    className?: string,
}


interface ChoiceBoxState {
    open: boolean
}


export class ChoiceBox extends Component<ChoiceBoxProps, ChoiceBoxState> {

    constructor(props: Readonly<ChoiceBoxProps>) {
        super(props);
        this.state = {
            open: false,
        };
        this.getClassNames = this.getClassNames.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidUpdate() {
        const {open} = this.state;
        setTimeout(() => {
            if (open) {
                window.addEventListener('click', this.close)
            } else {
                window.removeEventListener('click', this.close)
            }
        }, 0)
    }

    close() {
        this.setState({
            open: false
        })
    }

    toggle() {
        this.setState({
            open: !this.state.open
        })
    }

    getClassNames() {
        return concatClasses(
            "choicebox",
            (this.state.open ? "choicebox-open" : "choicebox-closed"),
            this.props.className
        );
    }

    render(): ReactElement {
        return (
            <div className={this.getClassNames()}>
                <Button className={"choicebox-button"}
                        variant={this.props.variant}
                        iconRight={<BsChevronDown/>}
                        onAction={this.toggle}
                >
                    {this.props.selected}
                    {this.props.autoWidth && this.props.items
                        .map(item => <div className={"choicebox-button-dummy-content"}>{item}</div>)
                    }
                </Button>
                {
                    this.state.open && (
                        <Dropdown className={"choicebox-dropdown"}
                                  items={this.props.items}
                                  itemFilter={this.props.itemFilter}
                                  selectedItem={this.props.selected}
                                  onSelect={this.props.onSelect}
                                  maxVisibleItems={this.props.maxVisibleItems}/>
                    )
                }
            </div>
        );
    }
}
