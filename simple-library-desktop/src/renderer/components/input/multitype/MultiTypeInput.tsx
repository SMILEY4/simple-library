import {BaseProps, concatClasses} from "../../utils/common";
import React, {useState} from "react";
import {Label} from "../../base/label/Label";
import "./multiTypeInput.css";
import {NUMERIC_INPUT, TextField, TFAcceptCause} from "../textfield/TextField";
import {DateTimeInput} from "../datetime/DateTimeInput";

export type MultiTypeInputType = "text" | "number" | "date" | "boolean";

export interface MultiTypeInputProps extends BaseProps {
	value?: string,
	type?: MultiTypeInputType,
	onAccept?: (value: string) => void,
}

export function MultiTypeInput(props: React.PropsWithChildren<MultiTypeInputProps>): React.ReactElement {

	const [editMode, setEditMode] = useState(false);
	const [type, setType] = useState<MultiTypeInputType>(props.type ? props.type : "text");
	const [value, setValue] = useState(props.value ? props.value : "");


	return editMode
		? renderEditMode()
		: renderDisplayMode();


	function renderDisplayMode(): React.ReactElement {
		return (
			<div
				className={concatClasses(props.className, "multi-type-input", "multi-type-input-display")}
				onClick={handleEnterEditMode}
				onDoubleClick={(e: any) => e.stopPropagation()}
			>
				<Label overflow="cutoff" underline>
					{value}
				</Label>
			</div>
		);
	}


	function renderEditMode(): React.ReactElement {
		switch (type) {
			case "text":
				return renderEditModeText();
			case "number":
				return renderEditModeNumber();
			case "date":
				return renderEditModeDate();
			case "boolean":
				return renderEditModeText();
		}
	}


	function renderEditModeText(): React.ReactElement {
		return (
			<TextField
				value={value}
				onAccept={handleAcceptText}
				autofocus
				className={concatClasses(props.className, "multi-type-input", "multi-type-input-text")}
				onDoubleClick={(e: any) => e.stopPropagation()}
				draggable
				onDragStart={(e: any) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
		);
	}


	function renderEditModeNumber(): React.ReactElement {
		return (
			<TextField
				value={Number(value).toString()}
				regexChange={NUMERIC_INPUT}
				regexAccept={NUMERIC_INPUT}
				onAccept={handleAcceptText}
				autofocus
				className={concatClasses(props.className, "multi-type-input", "multi-type-input-number")}
				onDoubleClick={(e: any) => e.stopPropagation()}
				draggable
				onDragStart={(e: any) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
		);
	}


	function renderEditModeDate(): React.ReactElement {
		if (isNaN(new Date(Date.parse(value)).getTime())) {
			return renderEditModeInvalid();
		} else {
			return (
				<DateTimeInput
					value={new Date(Date.parse(value))}
					onAccept={handleAcceptDate}
					onCancel={handleCancelDate}
					forceOpen
					showTimeSelect
					toggleInputField
					labelFillWidth
					underline
				/>
			);
		}
	}


	function renderEditModeInvalid(): React.ReactElement {
		return (
			<Label
				className={concatClasses(props.className, "multi-type-input", "multi-type-input-invalid")}
				overflow="nowrap-hidden"
				italic
				disabled
			>
				invalid
			</Label>
		);
	}


	function handleEnterEditMode(): void {
		setEditMode(true);
	}


	function handleAcceptText(newValue: string, cause: TFAcceptCause): Promise<void> | void {
		if ((cause === "enter" || cause === "blur") && props.onAccept) {
			return Promise.resolve(props.onAccept(newValue))
				.then(() => exitEditMode(newValue))
				.catch(() => exitEditMode(value));
		} else {
			exitEditMode(newValue);
		}
	}


	function handleAcceptDate(newValue: Date): Promise<void> | void {
		const newValueStr = "" + newValue;
		if (props.onAccept) {
			return Promise.resolve(props.onAccept(newValueStr))
				.then(() => exitEditMode(newValueStr))
				.catch(() => exitEditMode(value));
		} else {
			exitEditMode(newValueStr);
		}
	}


	function handleCancelDate(): void {
		setEditMode(false);
	}


	function exitEditMode(newValue: string) {
		setValue(newValue);
		setEditMode(false);
	}

}
