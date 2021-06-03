import * as React from 'react';
import {ReactElement, useState} from 'react';
import {BaseProps, concatClasses, map, orDefault, Type, Variant,} from '../../common/common';
import {Pane} from '../../base/pane/Pane';
import {getFillActive, getFillDefault, getFillReady, getOutline, STATIC_PANE_CONFIG,} from '../../base/pane/paneConfig';
import "./textarea.css";

export interface TextAreaProps extends BaseProps {
    value?: string,
    placeholder?: string,
    cols?: number,
    rows?: number,
    wrap?: "hard" | "soft",
    resize?: "none" | "horizontal" | "vertical"
    forceState?: boolean,
    variant?: Variant,
    type?: Type,
    error?: boolean,
    disabled?: boolean,
    autoFocus?: boolean,
    onChange?: (value: string) => void,
    onAccept?: (value: string) => void
}


export function TextArea(props: React.PropsWithChildren<TextAreaProps>): ReactElement {

    const [value, setValue] = useState(props.value ? props.value : "");

    const variant: Variant = orDefault(props.variant, Variant.OUTLINE);
    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(STATIC_PANE_CONFIG, variant, type, props.error)}
              fillDefault={getFillDefault(STATIC_PANE_CONFIG, variant, type)}
              fillReady={getFillReady(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              fillActive={getFillActive(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              className={concatClasses(
                  "text-area",
                  map(props.resize, (resize) => "text-area-resize-" + resize)
              )}
              forwardRef={props.forwardRef}
        >
            <textarea
                autoFocus={props.autoFocus}
                disabled={props.disabled}
                value={value}
                placeholder={props.placeholder}
                wrap={props.wrap}
                cols={props.cols}
                rows={props.rows}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
        </Pane>
    );

    function handleChange(event: any): void {
        onChange(event.target.value);
    }

    function handleBlur(event: any): void {
        onAccept(event.target.value);
    }

    function handleKeyDown(event: any) {
        if (event.key === 'Enter' && event.ctrlKey) {
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
