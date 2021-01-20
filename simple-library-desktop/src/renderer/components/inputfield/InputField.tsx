import * as React from "react";
import {Component, ReactElement} from "react";
import "./inputField.css"
import { HighlightType, StyleType, toStringOrDefault } from '../common';
import { GradientBorderBox } from '../gradientborder/GradientBorderBox';

interface InputFieldProps {
    type: HighlightType,
    style: StyleType,
    invalid?: boolean,

    text?: string,
    initialText?: string,
    placeholder?: string,

    disabled?: boolean,
    editable?: boolean,

    maxLength?: number,

    label?: string,
    icon?: any,
    contentLeading?: any,
    contentTrailing?: any

    onChange?: (value: string) => void
    onAccept?: (value: string) => void
}


interface GenericInputFieldProps extends Omit<InputFieldProps, 'style'> {
}


interface InputFieldState {
    text: string
}


export class InputField extends Component<InputFieldProps, InputFieldState> {

    constructor(props: InputFieldProps) {
        super(props);
        this.state = {
            text: toStringOrDefault(this.props.initialText, "")
        };
        this.onValueChange = this.onValueChange.bind(this)
        this.onLeaveField = this.onLeaveField.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    onValueChange(event: any) {
        const nextValue = event.target.value;
        this.setState({text: nextValue})
        if (this.props.onChange) {
            this.props.onChange(nextValue)
        }
    }

    onLeaveField() {
        if (this.props.onAccept) {
            this.props.onAccept(this.state.text)
        }
    }

    handleKeyDown(event: any) {
        if (this.props.onAccept && event.key === 'Enter') {
            this.props.onAccept(this.state.text)
            event.target.blur()
        }
    }

    render() {
        return (
            <div className={"input-field-root"}>
                {
                    this.props.label
                        ? <div className={"input-field-label"}>{this.props.label}</div>
                        : null
                }
                <GradientBorderBox
                    gradient={this.props.invalid === true ? HighlightType.ERROR : this.props.type}
                    className={"input-field-wrapper"}
                    innerClassName={"input-field-wrapper-content input-field-wrapper-content-" + this.props.style}
                >
                    {
                        this.props.contentLeading
                            ? <div className={"input-field-content-leading"}>{this.props.contentLeading}</div>
                            : null
                    }
                    {
                        this.props.icon
                            ? <div className={"input-field-icon"}>{this.props.icon}</div>
                            : null
                    }
                    <input
                        value={this.props.text ? this.props.text : this.state.text}
                        type="text"
                        placeholder={this.props.placeholder}
                        disabled={this.props.disabled || this.props.editable === false}
                        maxLength={this.props.maxLength}
                        onChange={this.onValueChange}
                        onBlur={this.onLeaveField}
                        onKeyDown={this.handleKeyDown}
                    />
                    {
                        this.props.contentTrailing
                            ? <div className={"input-field-content-trailing"}>{this.props.contentTrailing}</div>
                            : null
                    }
                </GradientBorderBox>
            </div>
        )
    }

}


export function InputFieldFilled(props: React.PropsWithChildren<GenericInputFieldProps>): ReactElement {
    const baseProps: InputFieldProps = {
        style: StyleType.FILLED,
        ...props
    }
    return <InputField {...baseProps}/>
}


export function InputFieldGhostBg0(props: React.PropsWithChildren<GenericInputFieldProps>): ReactElement {
    const baseProps: InputFieldProps = {
        style: StyleType.GHOST_BG0,
        ...props
    }
    return <InputField {...baseProps}/>
}


export function InputFieldGhostBg1(props: React.PropsWithChildren<GenericInputFieldProps>): ReactElement {
    const baseProps: InputFieldProps = {
        style: StyleType.GHOST_BG1,
        ...props
    }
    return <InputField {...baseProps}/>
}

