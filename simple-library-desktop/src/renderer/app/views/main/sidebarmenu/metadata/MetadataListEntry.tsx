import React, {ReactElement} from "react";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";
import {AttributeDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";
import {NUMERIC_INPUT} from "../../../../../components/input/textfield/TextField";
import {DateTimeInput} from "../../../../../components/input/datetime/DateTimeInput";
import {ListInputField} from "../../../../../components/input/list/ListInputField";
import {Label} from "../../../../../components/base/label/Label";

interface MetadataListEntryProps {
	isEmpty?: boolean,
	entry: AttributeDTO,
	shortName: string,
	keySize?: number,
	styleType?: "focus-key" | "focus-value",
	onUpdateValue: (prev: AttributeValueDTO, next: AttributeValueDTO) => void,
	onContextMenu: (attributeKey: string, event: React.MouseEvent) => void,
}


export function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

	return (
		<KeyValuePair
			keyValue={props.shortName}
			styleType={props.styleType ? props.styleType : "focus-key"}
			onContextMenu={event => props.onContextMenu(props.entry.key, event)}
			showOverflow={props.entry.type === "date"}
			keySize={props.keySize}
		>
			{props.isEmpty === true
				? <Label overflow="nowrap-hidden" italic disabled>none</Label>
				: renderInputField()}
		</KeyValuePair>
	);

	function renderInputField(): ReactElement {
		switch (props.entry.type) {
			case "text":
				return renderInputText();
			case "number":
				return renderInputNumber();
			case "boolean":
				return renderInputBoolean();
			case "date":
				return renderInputDate();
			case "list":
				return renderInputList();
		}
	}

	function renderInputText(): ReactElement {
		return (
			<ToggleTextField
				fillWidth
				value={props.entry.value as string}
				onAccept={handleUpdateValue}
			/>
		);
	}

	function renderInputNumber(): ReactElement {
		return (
			<ToggleTextField
				fillWidth
				regexChange={NUMERIC_INPUT}
				regexAccept={NUMERIC_INPUT}
				value={(props.entry.value as number).toString()}
				onAccept={handleUpdateValue}
			/>
		);
	}

	function renderInputBoolean(): ReactElement {
		return (
			<CheckBox
				selected={props.entry.value as boolean}
				onToggle={(selected: boolean) => handleUpdateValue(selected)}
			/>
		);
	}

	function renderInputDate(): ReactElement {
		if (isNaN((props.entry.value as Date).getTime())) {
			return renderInvalid();
		} else {
			return (
				<DateTimeInput
					value={props.entry.value as Date}
					onAccept={value => handleUpdateValue(value)}
					showTimeSelect
					toggleInputField
					labelFillWidth
				/>
			);
		}
	}

	function renderInputList(): ReactElement {
		return (
			<ListInputField
				listName={props.entry.key}
				initItems={props.entry.value as string[]}
				onSave={value => handleUpdateValue(value)}
				fillWidth
			/>
		);
	}

	function renderInvalid(): ReactElement {
		return <Label overflow="nowrap-hidden" italic disabled>invalid</Label>;
	}

	function handleUpdateValue(value: AttributeValueDTO): void {
		props.onUpdateValue(props.entry.value, value);
	}

}
