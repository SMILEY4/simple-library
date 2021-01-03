import * as React from "react";
import {Component} from "react";
import {GradientBorderWrapper} from "_renderer/components/GradientBorderWrapper";

export enum TextFieldType {
    DEFAULT = "default",
    INFO = "info",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}

interface TextFieldBaseProps {

}

type TextFieldBaseState = {

}

class TextFieldBase extends Component<{}, TextFieldBaseState> {

    constructor(props: TextFieldBaseProps) {
        super(props);

    }

    componentWillReceiveProps(nextProps: TextFieldBaseProps) {
        if (nextProps.initialValue && nextProps.initialValue !== this.state.value) {
            this.setState({value: nextProps.initialValue})
        }
    }

    render() {
        if (this.props.type === undefined || this.props.type === "default") {
            return (
                <div className={this.getClassName()}>
                    {this.props.children}
                    <input
                        value={this.state.value}
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
            )

        } else {
            return (
                <GradientBorderWrapper className={this.getWrapperClassNames()}>
                    <div className={this.getInnerClassNames()}>
                        {this.props.children}
                        <input
                            value={this.state.value}
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

}
