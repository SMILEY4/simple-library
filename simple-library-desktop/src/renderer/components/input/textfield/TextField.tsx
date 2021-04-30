import * as React from 'react';
import { ReactElement, useState } from 'react';
import {
    BaseProps,
    ColorType,
    concatClasses,
    Fill,
    getIf,
    GroupPosition,
    orDefault,
    Size,
    Type,
    Variant,
} from '../../common/common';
import { Pane } from '../../base/pane/Pane';
import {
    getFillActive,
    getFillDefault,
    getFillReady,
    getOutline,
    STATIC_PANE_CONFIG,
} from '../../base/pane/paneConfig';
import "./textfield.css";
import { HBox } from '../../layout/box/Box';
import { Icon, IconType } from '../../base/icon/Icon';

export interface TextFieldProps extends BaseProps {
    value?: string,
    placeholder?: string,
    forceState?: boolean,
    variant?: Variant,
    type?: Type,
    error?: boolean,
    groupPos?: GroupPosition,
    disabled?: boolean,
    autoFocus?: boolean,
    iconLeft?: IconType,
    iconRight?: IconType,
    onChange?: (value: string) => void,
    onAccept?: (value: string) => void
}


export function TextField(props: React.PropsWithChildren<TextFieldProps>): ReactElement {

    const [value, setValue] = useState(props.value ? props.value : "");

    const variant: Variant = orDefault(props.variant, Variant.OUTLINE);
    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(STATIC_PANE_CONFIG, variant, type, props.error)}
              fillDefault={getFillDefault(STATIC_PANE_CONFIG, variant, type)}
              fillReady={getFillReady(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              fillActive={getFillActive(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              groupPos={props.groupPos}
              className={"text-field"}
              forwardRef={props.forwardRef}
        >
            <HBox fill={Fill.TRUE}>
                {props.iconLeft && (
                    <Icon type={props.iconLeft}
                          size={Size.S_1}
                          className={"icon-left"}
                          color={props.variant === Variant.SOLID && props.type !== Type.DEFAULT ? ColorType.TEXT_ON_COLOR : undefined}
                    />
                )}
                <input className={concatClasses("input", getIf(props.variant === Variant.SOLID && props.type !== Type.DEFAULT, "input-on-colored"))}
                       type='text'
                       value={value}
                       autoFocus={props.autoFocus}
                       disabled={props.disabled}
                       placeholder={props.placeholder}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       onKeyDown={handleKeyDown}
                />
                {props.iconRight && (
                    <Icon type={props.iconRight}
                          size={Size.S_1}
                          className={"icon-right"}
                          color={props.variant === Variant.SOLID && props.type !== Type.DEFAULT ? ColorType.TEXT_ON_COLOR : undefined}
                    />
                )}
            </HBox>
        </Pane>
    );

    function handleChange(event: any): void {
        onChange(event.target.value);
    }

    function handleBlur(event: any): void {
        onAccept(event.target.value);
    }

    function handleKeyDown(event: any) {
        if (event.key === 'Enter') {
            onAccept(event.target.value);
            event.target.blur();
        }
    }

    function onChange(newValue: string): void {
        if (!props.disabled) {
            if (!props.forceState) {
                setValue(newValue);
            }
            if (props.onChange) {
                props.onChange(newValue);
            }
        }
    }

    function onAccept(newValue: string): void {
        if (!props.disabled) {
            if (!props.forceState) {
                setValue(newValue);
            }
            if (props.onAccept) {
                props.onAccept(newValue);
            }
        }
    }

}
