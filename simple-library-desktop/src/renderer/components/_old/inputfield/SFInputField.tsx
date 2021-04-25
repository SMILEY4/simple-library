import React, { Component } from 'react';
import { InputField, InputFieldProps } from './InputField';


interface SFInputFieldState {
    value: string
}

export class SFInputField extends Component<InputFieldProps, SFInputFieldState> {

    constructor(props: Readonly<InputFieldProps>) {
        super(props);
        this.state = {
            value: props.value ? props.value : "",
        };
    }

    render() {
        const inputFieldProps: InputFieldProps = {
            ...this.props,
            value: this.state.value,
            onChange: (value: string) => {
                if (this.props.onChange) {
                    this.props.onChange(value);
                }
                this.setState({ value: value });
            },
        };
        return <InputField {...inputFieldProps} />;
    }
}