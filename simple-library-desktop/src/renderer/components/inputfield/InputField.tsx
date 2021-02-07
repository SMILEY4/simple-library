import * as React from 'react';
import { Component } from 'react';
import "./inputfield.css";
import { concatClasses, GroupPosition, map } from '../common';

interface InputFieldProps {
    placeholder?: string,
    initialValue?: string,

    disabled?: boolean,
    locked?: boolean,

    icon?: any,
    iconRight?: any,

    contentLeading?: any,
    contentTrailing?: any,

    onChange?: (value: string) => void,
    onAccept?: (value: string) => void
}

interface InputFieldState {
    value: string
}


export class InputField extends Component<InputFieldProps, InputFieldState> {

    constructor(props: InputFieldProps) {
        super(props);
        this.state = {
            value: props.initialValue || "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLooseFocus = this.handleLooseFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.calcGroupPosition = this.calcGroupPosition.bind(this);
        this.getClassNames = this.getClassNames.bind(this);
    }

    handleChange(event: any) {
        const newValue: string = event.target.value;
        this.setState({ value: newValue });
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    handleLooseFocus(event: any) {
        if (this.props.onAccept) {
            this.props.onAccept(event.target.value);
        }
    }

    handleKeyDown(event: any) {
        if (this.props.onAccept && event.key === 'Enter') {
            this.props.onAccept(event.target.value);
            event.target.blur();
        }
    }

    calcGroupPosition(): GroupPosition | undefined {
        if (this.props.contentLeading && this.props.contentTrailing) {
            return GroupPosition.MIDDLE;
        } else if (!this.props.contentLeading && this.props.contentTrailing) {
            return GroupPosition.START;
        } else if (this.props.contentLeading && !this.props.contentTrailing) {
            return GroupPosition.END;
        }
        return undefined;
    }

    getClassNames() {
        return concatClasses(
            "input-field",
            map(this.props.disabled, (disabled) => 'input-field-disabled'),
            map(this.props.locked, (locked) => 'input-field-locked'),
            map(this.calcGroupPosition(), (groupPos) => 'input-field-group-pos-' + groupPos),
        );
    }



    render() {
        return (
            <div className={"input-field-wrapper"}>
                {
                    this.props.contentLeading
                        ? this.props.contentLeading
                        : null
                }
                <div className={this.getClassNames()}>
                    {this.props.icon ? this.props.icon : null}
                    <input className='input'
                           type='text'
                           disabled={this.props.disabled || this.props.locked}
                           value={this.state.value}
                           placeholder={this.props.placeholder}
                           onChange={this.handleChange}
                           onBlur={this.handleLooseFocus}
                           onKeyDown={this.handleKeyDown}
                    />
                    {this.props.iconRight ? this.props.iconRight : null}
                </div>
                {
                    this.props.contentTrailing
                        ? this.props.contentTrailing
                        : null
                }
            </div>

        );
    }
}