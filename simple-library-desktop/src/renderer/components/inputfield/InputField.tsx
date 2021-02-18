import * as React from 'react';
import { ReactElement } from 'react';
import "./inputfield.css";
import { AlignCross, AlignMain, concatClasses, GroupPosition, map } from '../common';
import { HBox } from '../layout/Box';

export interface InputFieldProps {
    placeholder?: string,
    value?: string,

    disabled?: boolean,
    locked?: boolean,

    icon?: any,
    iconRight?: any,

    contentLeading?: any,
    contentTrailing?: any,

    onChange?: (value: string) => void,
    onAccept?: (value: string) => void,

    className?: string
}

export function InputField(props: React.PropsWithChildren<InputFieldProps>): ReactElement {

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
        if (props.onAccept && event.key === 'Enter') {
            callOnAccept(event.target.value);
            event.target.blur();
        }
    }

    function calcGroupPosition(): GroupPosition | undefined {
        if (props.contentLeading && props.contentTrailing) {
            return GroupPosition.MIDDLE;
        } else if (!props.contentLeading && props.contentTrailing) {
            return GroupPosition.START;
        } else if (props.contentLeading && !props.contentTrailing) {
            return GroupPosition.END;
        }
        return undefined;
    }

    function getClassNames() {
        return concatClasses(
            "input-field",
            map(props.disabled, (disabled) => 'input-field-disabled'),
            map(props.locked, (locked) => 'input-field-locked'),
            map(calcGroupPosition(), (groupPos) => 'input-field-group-pos-' + groupPos),
        );
    }


    return (
        <div className={"input-field-wrapper"}>
            {
                props.contentLeading
                    ? props.contentLeading
                    : null
            }
            <div className={getClassNames()}>
                {props.icon ? props.icon : null}
                <input className='input'
                       type='text'
                       disabled={props.disabled || props.locked}
                       value={props.value}
                       placeholder={props.placeholder}
                       onChange={handleChange}
                       onBlur={handleLooseFocus}
                       onKeyDown={handleKeyDown}
                />
                {props.iconRight ? props.iconRight : null}
            </div>
            {
                props.contentTrailing
                    ? props.contentTrailing
                    : null
            }
        </div>

    );
}