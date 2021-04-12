import * as React from 'react';
import { ReactElement, useState } from 'react';
import { concatClasses, GroupPosition, map, Size } from '../common';
import "../inputfield/inputfield.css";
import { VBox } from '../layout/Box';
import { CaptionText } from '../text/Text';

interface NewInputFieldProps {

    placeholder?: string,
    initialValue?: string,

    disabled?: boolean,
    locked?: boolean,

    autoFocus?: boolean

    validation?: (value: string) => string | null,
    validateOnChange?: boolean,
    validateOnSubmit?: boolean,
    showError?: boolean,
    triggerValidation?: (fun: () => boolean) => void,

    icon?: any,
    iconRight?: any,
    contentLeading?: any,
    contentTrailing?: any,

    onValidated?: (valid: boolean, value: string) => void,
    onChange?: (value: string) => void,
    onSubmit?: (value: string) => void,

    className?: string
}

export function NewInputField(props: React.PropsWithChildren<NewInputFieldProps>): ReactElement {

    const [value, setValue] = useState(props.initialValue ? props.initialValue : "");
    const [valid, setValid] = useState(true);
    const [error, setError] = useState("");

    props.triggerValidation && props.triggerValidation(() => doValidate(value));

    return (
        <VBox spacing={Size.S_0_15}>
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
                           placeholder={props.placeholder}
                           value={value}
                           autoFocus={props.autoFocus}
                           disabled={props.disabled || props.locked}
                           onChange={handleOnChange}
                           onBlur={handleOnBlur}
                           onKeyDown={handleOnKeyDown}
                    />
                    {props.iconRight ? props.iconRight : null}
                </div>
                {
                    props.contentTrailing
                        ? props.contentTrailing
                        : null
                }
            </div>
            {/*{props.showError === true && (*/}
            {/*    valid*/}
            {/*        ? (<div style={{ height: "1em" }} />)*/}
            {/*        : (<CaptionText color={"var(--color-error-3)"} style={{*/}
            {/*            height: "1em",*/}
            {/*            fontWeight: 500,*/}
            {/*        }}>{error}</CaptionText>)*/}
            {/*)}*/}
        </VBox>
    );

    function handleOnChange(event: any): void {
        doChange(event.target.value);
    }

    function handleOnBlur(event: any): void {
        doSubmit(event.target.value, event.target);
    }

    function handleOnKeyDown(event: any): void {
        if (event.key === 'Enter') {
            doSubmit(event.target.value, event.target);
        }
    }

    function doSubmit(value: string, eventTarget: any) {
        setValue(value);
        eventTarget.blur();
        if (props.validateOnSubmit) {
            doValidate(value);
        }
        if (props.onSubmit) {
            props.onSubmit(value);
        }
    }

    function doChange(value: string) {
        setValue(value);
        if (props.validateOnChange) {
            doValidate(value);
        }
        if (props.onChange) {
            props.onChange(value);
        }
    }

    function doValidate(value: string): boolean {
        if (props.validation) {
            const error: string | null = props.validation(value);
            setError(error);
            setValid(error === null);
            if (props.onValidated) {
                props.onValidated(error === null, value);
            }
            return error === null;
        } else {
            return true;
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
            (props.disabled === true ? 'input-field-disabled' : null),
            (props.locked === true ? 'input-field-locked' : null),
            (valid === false ? 'input-field-invalid' : null),
            map(calcGroupPosition(), (groupPos) => 'input-field-group-pos-' + groupPos),
        );
    }

}