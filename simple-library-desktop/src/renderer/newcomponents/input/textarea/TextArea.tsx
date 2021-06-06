import {BaseProps} from "../../utils/common";
import * as React from "react";
import {ReactElement, useState} from "react";
import {concatClasses, map} from "../../../components/common/common";
import {BaseElementInset} from "../../base/element/BaseElementInset";
import "./textArea.css"

export interface TextAreaProps extends BaseProps {
	value?: string,
	forceState?: boolean,
	placeholder?: string
	disabled?: boolean,
	cols?: number,
	rows?: number,
	autofocus?: boolean,
	wrap?: "hard" | "soft",
	resize?: "none" | "horizontal" | "vertical"
	error?: boolean,
	onChange?: (value: string) => void,
	onAccept?: (value: string) => void
}


export function TextArea(props: React.PropsWithChildren<TextAreaProps>): ReactElement {

	const [value, setValue] = useState(props.value ? props.value : "");

	return (
		<BaseElementInset
			disabled={props.disabled}
			error={props.error}
			className={concatClasses(
				props.className,
				"text-area",
				map(props.resize, resize => "text-area-" + resize)
			)}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			<textarea
				autoFocus={props.autofocus}
				disabled={props.disabled}
				value={value}
				placeholder={props.placeholder}
				wrap={props.wrap}
				cols={props.cols}
				rows={props.rows}
				onChange={handleOnChange}
				onBlur={handleOnBlur}
				onKeyDown={handleOnKeyDown}
			/>
		</BaseElementInset>
	);

	function handleOnChange(event: any) {
		handleChange(event.target.value, props.onChange);
	}


	function handleOnBlur(event: any) {
		handleChange(event.target.value, props.onAccept);
	}


	function handleOnKeyDown(event: any) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleChange(event.target.value, props.onAccept);
			event.target.blur();
		}
	}

	function handleChange(newValue: string, callback: (v: string) => void) {
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
