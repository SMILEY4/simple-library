import * as React from 'react';
import { ReactElement } from 'react';
import "./textarea.css";
import { concatClasses } from '../common';

export interface TextAreaProps {
    placeholder?: string,
    value?: string,

    disabled?: boolean,
    locked?: boolean,
    autoFocus?: boolean
    invalid?: boolean,

    wrap?: string,
    cols?: number
    rows?: number,

    onChange?: (value: string) => void,
    onAccept?: (value: string) => void,

    className?: string
}

export function TextArea(props: React.PropsWithChildren<TextAreaProps>): ReactElement {

    function callOnChange(value: string) {
        if (props.onChange && !props.disabled && !props.locked) {
            props.onChange(value);
        }
    }

    function callOnAccept(value: string) {
        if (props.onAccept && !props.disabled && !props.locked) {
            props.onAccept(value);
        }
    }

    function handleChange(event: any) {
        callOnChange(event.target.value);
    }

    function handleLooseFocus(event: any) {
        callOnAccept(event.target.value);
    }

    function handleKeyDown(event: any) {
        if (props.onAccept && event.key === 'Enter' && event.ctrlKey) {
            callOnAccept(event.target.value);
            event.target.blur();
        }
    }

    function getClassNames() {
        return concatClasses(
            "text-area",
            (props.disabled === true ? 'text-area-disabled' : null),
            (props.locked === true ? 'text-area-locked' : null),
            (props.invalid === true ? 'text-area-invalid' : null),
        );
    }


    return (
        <div className={getClassNames()}>
            <textarea
                autoFocus={props.autoFocus}
                disabled={props.disabled || props.locked}
                value={props.value}
                placeholder={props.placeholder}
                wrap={props.wrap}
                cols={props.cols}
                rows={props.rows}
                onChange={handleChange}
                onBlur={handleLooseFocus}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}