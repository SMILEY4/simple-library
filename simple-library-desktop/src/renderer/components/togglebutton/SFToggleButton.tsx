import * as React from 'react';
import { Component } from 'react';
import { ToggleButton, ToggleButtonProps } from './ToggleButton';


interface SFToggleButtonState {
    value: boolean
}

export class SFToggleButton extends Component<ToggleButtonProps, SFToggleButtonState> {

    constructor(props: Readonly<ToggleButtonProps>) {
        super(props);
        this.state = {
            value: props.active ? props.active : false,
        };
    }


    render() {
        const toggleButtonProps: ToggleButtonProps = {
            ...this.props,
            active: this.state.value,
            onToggle: (active: boolean) => {
                if (this.props.onToggle) {
                    this.props.onToggle(active);
                }
                this.setState({ value: active });
            },
        };
        return (
            <ToggleButton {...toggleButtonProps} />
        );
    }
}