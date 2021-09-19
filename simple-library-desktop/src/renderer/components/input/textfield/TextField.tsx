import * as React from "react";
import {MutableRefObject, ReactElement, useRef, useState} from "react";
import {BaseElementInset} from "../../base/element/BaseElementInset";
import {BaseProps, concatClasses} from "../../utils/common";
import {Icon, IconType} from "../../base/icon/Icon";
import "./textfield.css";

export type TFAcceptCause = "blur" | "escape" | "enter" | "change"

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
	onClickPrependIcon?: () => void,
	onClickAppendIcon?: () => void,
	dir?: "rtl"
	fixed?: boolean,
	onChange?: (value: string) => void | Promise<void>,
	onAccept?: (value: string, cause?: TFAcceptCause) => void | Promise<void>,
	refInputField?: MutableRefObject<any>
	onDoubleClick?: (event: React.MouseEvent) => void,
	draggable?: boolean,
	onDragStart?: (event: React.DragEvent) => void
}

export function TextField(props: React.PropsWithChildren<TextFieldProps>): ReactElement {

	const [value, setValue] = useState(props.value ? props.value : "");
	const shouldIgnoreBlur = useRef(false);

	return (
		<BaseElementInset
			disabled={props.disabled}
			error={props.error}
			groupPos={props.groupPos}
			className={concatClasses(props.className, "text-field")}
			style={props.style}
			forwardRef={props.forwardRef}
			onDoubleClick={props.onDoubleClick}
			draggable={props.draggable}
			onDragStart={props.onDragStart}
		>
			{props.prependIcon && (
				<Icon
					type={props.prependIcon}
					size="1" color="primary"
					disabled={props.disabled}
					onClick={props.onClickPrependIcon}
				/>
			)}
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
				ref={props.refInputField}
			/>
			{props.appendIcon && (
				<Icon
					type={props.appendIcon}
					size="1"
					color="primary"
					disabled={props.disabled}
					onClick={props.onClickAppendIcon}
				/>
			)}
		</BaseElementInset>
	);

	function handleOnChange(event: any) {
		handleChange("change", event.target.value, props.onChange);
	}


	function handleOnBlur(event: any) {
		if (!shouldIgnoreBlur.current) {
			handleChange("blur", event.target.value, props.onAccept);
		}
		shouldIgnoreBlur.current = false;
	}


	function handleOnKeyDown(event: any) {
		if (event.key === "Enter") {
			event.stopPropagation();
			shouldIgnoreBlur.current = true;
			event.target.blur();
			handleChange("enter", event.target.value, props.onAccept);
		}
		if (event.key === "Escape") {
			event.stopPropagation();
			setValue(props.value);
			event.target.value = props.value;
			shouldIgnoreBlur.current = true;
			event.target.blur();
			handleChange("escape", event.target.value, props.onAccept);
		}
	}

	function handleChange(cause: TFAcceptCause, newValue: string, callback: (v: string, cause?: string) => void | Promise<void>) {
		if (!props.disabled) {
			if (!props.forceState) {
				setValue(newValue);
			}
			if (callback) {
				Promise.resolve(callback(newValue, cause))
					.catch(() => setValue(props.value));
			}
		}
	}

}
