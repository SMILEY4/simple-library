import * as React from "react";
import {Component} from "react";
import "./textfields.css"
import {GradientBorderWrapper} from "_renderer/components/GradientBorderWrapper";
import {HighlightType, StyleType, toStringOrDefault} from "_renderer/components/Common";


interface TextFieldProps {
    highlight: HighlightType,
    style: StyleType,
    bg?: string,
    initialText?: string,
    placeholder?: string,
    editable?: boolean,
    disabled?: boolean,
    fieldSize?: number,
    maxLength?: number
    className?: string,
    innerClassName?: string,
    onChange?: (value: string) => {},
    onAccept?: (value: string) => {},
}


interface TextFieldState {
    text: string
}


export class TextField extends Component<TextFieldProps, TextFieldState> {


    constructor(props: TextFieldProps) {
        super(props);
        this.state = {
            text: toStringOrDefault(this.props.initialText, "")
        };
        this.getWrapperClassNames = this.getWrapperClassNames.bind(this)
        this.getInnerClassNames = this.getInnerClassNames.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.onLeaveField = this.onLeaveField.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    getWrapperClassNames(): string {
        return "text-field-wrapper"
            + " text-field-wrapper-" + this.props.style
            + " text-field-wrapper-" + this.props.highlight
            + (this.props.className ? " " + this.props.className : "")
    }

    getInnerClassNames(): string {
        return "text-field"
            + " text-field-" + this.props.style
            + " text-field-force-bg-" + toStringOrDefault(this.props.bg, "0")
            + (this.props.disabled ? " text-field-disabled" : "")
            + (this.props.editable === false ? " text-field-not-editable" : "")
            + (this.props.innerClassName ? " " + this.props.innerClassName : "")
    }

    onValueChange(event: any) {
        const nextValue = event.target.value;
        console.log("NEXT " + nextValue)
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
            <GradientBorderWrapper className={this.getWrapperClassNames()}>
                <div className={this.getInnerClassNames()}>
                    {this.props.children}
                    <input
                        value={this.state.text}
                        type="text"
                        placeholder={this.props.placeholder}
                        disabled={this.props.disabled || this.props.editable === false}
                        size={this.props.fieldSize}
                        maxLength={this.props.maxLength}
                        onChange={this.onValueChange}
                        onBlur={this.onLeaveField}
                        onKeyDown={this.handleKeyDown}
                    />
                </div>
            </GradientBorderWrapper>
        )
    }

}

