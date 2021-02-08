import * as React from 'react';
import { Component } from 'react';
import { GroupPosition, Type, Variant } from '../common';
import { Button } from './Button';

interface ToggleButtonProps {
    active?: boolean,
    variant: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    icon?: any,
    iconRight?: any
    disabled?: boolean,
    onToggle?: (active: boolean) => void
}

interface ToggleButtonState {
    active: boolean
}

export class ToggleButton extends Component<ToggleButtonProps, ToggleButtonState> {

    constructor(props: Readonly<ToggleButtonProps>) {
        super(props);
        this.state = {
            active: props.active === true,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const nextActive: boolean = !this.state.active;
        if (this.props.onToggle) {
            this.props.onToggle(nextActive);
        }
        console.log(nextActive)
        this.setState({
            active: nextActive,
        });
    }

    render() {
        const buttonProps: any = {
            renderAsActive: this.state.active,
            onAction: this.handleClick,
            ...this.props,
        };
        return (
            <Button {...buttonProps}>
                {this.props.children}
            </Button>
        );
    }
}