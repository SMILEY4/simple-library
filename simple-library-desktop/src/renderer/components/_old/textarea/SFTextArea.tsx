import React, { Component } from 'react';
import { TextArea, TextAreaProps } from './TextArea';


interface SFTextAreaState {
    value: string
}

export class SFTextArea extends Component<TextAreaProps, SFTextAreaState> {

    constructor(props: Readonly<TextAreaProps>) {
        super(props);
        this.state = {
            value: props.value ? props.value : "",
        };
    }

    render() {
        const textAreaProps: TextAreaProps = {
            ...this.props,
            value: this.state.value,
            onChange: (value: string) => {
                if (this.props.onChange) {
                    this.props.onChange(value);
                }
                this.setState({ value: value });
            },
        };
        return <TextArea {...textAreaProps} />;
    }
}