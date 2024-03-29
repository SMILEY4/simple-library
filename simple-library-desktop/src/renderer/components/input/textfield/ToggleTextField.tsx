import * as React from "react";
import {ReactElement, useEffect, useRef, useState} from "react";
import {TextField, TextFieldProps, TFAcceptCause} from "./TextField";
import {Label} from "../../base/label/Label";
import {concatClasses, getIf} from "../../utils/common";
import "./toggleTextField.css";

export interface ToggleTextFieldProps extends Omit<TextFieldProps, "refInputField" | "autofocus"> {
	fillWidth?: boolean;
	underline?: boolean,
}

export function ToggleTextField(props: React.PropsWithChildren<ToggleTextFieldProps>): ReactElement {

	const [editable, setEditable] = useState(false);
	const [value, setValue] = useState(props.value ? props.value : "");
	const refInput = useRef(null);

	useEffect(() => {
		if (!editable) {
			setValue(props.value);
		}
	}, [props.value]);

	useEffect(() => {
		if (editable) {
			refInput.current.select();
		}
	}, [editable]);

	if (editable) {
		return <TextField
			{...props}
			value={value}
			onAccept={handleAccept}
			refInputField={refInput}
			autofocus
			className={concatClasses(
				props.className,
				"toggle-text-field",
				"toggle-text-field-input",
				getIf(props.fillWidth, "toggle-text-field-fill")
			)}
			onDoubleClick={(e: any) => e.stopPropagation()}
			draggable
			onDragStart={(e: any) => {
				e.stopPropagation();
				e.preventDefault();
			}}
		/>;
	} else {
		return <div
			className={concatClasses(
				props.className,
				"toggle-text-field",
				"toggle-text-field-label",
				getIf(props.fillWidth, "toggle-text-field-fill")
			)}
			onClick={handleClickLabel}
			onDoubleClick={(e: any) => e.stopPropagation()}
		>
			<Label overflow="cutoff" underline={props.underline}>
				{value}
			</Label>
		</div>;
	}

	function handleClickLabel() {
		setEditable(true);
	}

	function handleAccept(newValue: string, cause: TFAcceptCause): Promise<void> | void {
		if ((cause === "enter" || cause === "blur")  && props.onAccept) {
			return Promise.resolve(props.onAccept(newValue))
				.then(() => lockField(newValue))
				.catch(() => lockField(value));
		} else {
			lockField(newValue);
		}
	}

	function lockField(value: string) {
		setValue(value);
		setEditable(false);
	}

}
