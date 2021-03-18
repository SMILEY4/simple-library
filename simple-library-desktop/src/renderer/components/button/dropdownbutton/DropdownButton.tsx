import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Button, ButtonProps } from '../Button';
import { Dropdown, DropdownActionItem, DropdownProps } from '../../dropdown/Dropdown';

interface DropdownButtonProps extends Omit<ButtonProps, 'renderAsActive'>, DropdownProps {
    buttonTitle: string | ReactElement,
    items?: DropdownActionItem[]
}

interface DropdownButtonState {
    showDropdown: boolean
}

export class DropdownButton extends Component<DropdownButtonProps, DropdownButtonState> {

    constructor(props: Readonly<DropdownButtonProps>) {
        super(props);
        this.state = {
            showDropdown: false,
        };
        this.close = this.close.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleSelectItem = this.handleSelectItem.bind(this);
        this.getButtonProps = this.getButtonProps.bind(this);
    }

    componentDidUpdate() {
        const { showDropdown } = this.state;
        setTimeout(() => {
            if (showDropdown) {
                window.addEventListener('click', this.close);
            } else {
                window.removeEventListener('click', this.close);
            }
        }, 0);
    }

    close() {
        this.setState({ showDropdown: false });
    }

    handleButtonClick() {
        if (!this.props.disabled) {
            this.setState({ showDropdown: !this.state.showDropdown });
        }
    }

    handleSelectItem(itemAction: () => void | undefined) {
        this.close();
        if (itemAction) {
            itemAction();
        }
    }

    getButtonProps(): ButtonProps {
        return {
            renderAsActive: this.state.showDropdown !== false,
            onAction: this.handleButtonClick,
            ...this.props,
        };
    }

    render(): ReactElement {

        return (
            <div className={"dropdown-button"}>
                <Button {...this.getButtonProps()}>
                    {this.props.buttonTitle}
                </Button>
                {this.state.showDropdown && (
                    <Dropdown maxVisibleItems={this.props.maxVisibleItems}
                              onTopSide={this.props.onTopSide}
                              items={this.props.items.map(item => {
                                  const itemAction = item.onAction;
                                  if (itemAction) {
                                      item.onAction = () => this.handleSelectItem(itemAction);
                                  }
                                  return item;
                              })}
                    />
                )}
            </div>
        );
    }
}
