import * as React from "react";
import {ReactElement, useState} from "react";
import {BaseElementInset} from "../../base/element/BaseElementInset";
import {BaseProps} from "../../common";
import {concatClasses} from "../../../components/common/common";
import {Icon, IconType} from "../../base/icon/Icon";
import "./textfield.css"

export interface TextFieldProps extends BaseProps {
	value?: string,
	placeholder?: string
	disabled?: boolean,
	autofocus?: boolean,
	forceState?: boolean,
	error?: boolean,
	groupPos?: "left" | "right" | "center",
	prependIcon?: IconType,
	appendIcon?: IconType,
	onChange?: (value: string) => void,
	onAccept?: (value: string) => void
}


export function TextField(props: React.PropsWithChildren<TextFieldProps>): ReactElement {

	const [value, setValue] = useState(props.value ? props.value : "");

	return (
		<BaseElementInset
			disabled={props.disabled}
			error={props.error}
			groupPos={props.groupPos}
			className={concatClasses("text-field", props.className)}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			{props.prependIcon && (<Icon type={props.prependIcon} size="1" color="primary" disabled={props.disabled}/>)}
			<input
				type="text"
				value={value}
				autoFocus={props.autofocus}
				disabled={props.disabled}
				placeholder={props.placeholder}
				onChange={handleOnChange}
				onBlur={handleOnBlur}
				onKeyDown={handleOnKeyDown}
			/>
			{props.appendIcon && (<Icon type={props.appendIcon} size="1" color="primary" disabled={props.disabled}/>)}
		</BaseElementInset>
	);

	function handleOnChange(event: any) {
		handleChange(event.target.value, props.onChange);
	}


	function handleOnBlur(event: any) {
		handleChange(event.target.value, props.onChange);
	}


	function handleOnKeyDown(event: any) {
		if (event.key === 'Enter') {
			handleChange(event.target.value, props.onAccept);
			event.target.blur();
		}
	}

	function handleChange(newValue: string, callback: (v:string) => void) {
		if (!props.disabled) {
			if (!props.forceState) {
				setValue(newValue);
			}
			if (callback) {
				callback(newValue);
			}
		}
	}

}
