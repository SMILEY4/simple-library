import * as React from 'react';
import {Component} from 'react';
import {Checkbox, CheckboxProps} from "./Checkbox";


interface SFCheckboxState {
    value: boolean
}

export class SFCheckbox extends Component<CheckboxProps, SFCheckboxState> {

    constructor(props: Readonly<CheckboxProps>) {
        super(props);
        this.state = {
            value: props.selected ? props.selected : false,
        };
    }


    render() {
        const toggleButtonProps: CheckboxProps = {
            ...this.props,
            selected: this.state.value,
            onToggle: (selected: boolean) => {
                if (this.props.onToggle) {
                    this.props.onToggle(selected);
                }
                this.setState({value: selected});
            },
        };
        return (
            <Checkbox {...toggleButtonProps} />
        );
    }
}
