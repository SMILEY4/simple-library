import * as React from "react";
import {ReactElement, useState} from "react";
import {BaseElementInset} from "../../base/element/BaseElementInset";
import {BaseProps} from "../../utils/common";
import {concatClasses, getIf} from "../../../components/common/common";
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
	dir?: "rtl"
	fixed?: boolean,
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
			className={concatClasses(props.className, "text-field")}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			{props.prependIcon && (<Icon type={props.prependIcon} size="1" color="primary" disabled={props.disabled}/>)}
			<input
				type="text"
				value={props.forceState ? props.value : value}
				autoFocus={props.autofocus}
				disabled={props.disabled || props.fixed}
				placeholder={props.placeholder}
				dir={props.dir}
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
		handleChange(event.target.value, props.onAccept);
	}


	function handleOnKeyDown(event: any) {
		if (event.key === 'Enter') {
			event.stopPropagation();
			event.target.blur();
			// onAccept triggered by blur
			handleChange(event.target.value, () => undefined);
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
