import * as React from 'react';
import { Component } from 'react';
import { DropdownButton, DropdownButtonProps } from './DropdownButton';


interface SFDropdownButtonState {
    showDropdown: boolean
}

export class SFDropdownButton extends Component<DropdownButtonProps, SFDropdownButtonState> {

    constructor(props: Readonly<DropdownButtonProps>) {
        super(props);
        this.state = {
            showDropdown: props.showDropdown ? props.showDropdown : false,
        };
    }


    render() {
        const dropdownButtonProps: DropdownButtonProps = {
            ...this.props,
            showDropdown: this.state.showDropdown,
            onToggle: (active: boolean) => {
                if (this.props.onToggle) {
                    this.props.onToggle(active);
                }
                this.setState({ showDropdown: active });
            },
        };
        return (
            <DropdownButton {...dropdownButtonProps} />
        );
    }
}