import React, {ReactElement} from "react";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";
import {AttributeDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";
import {NUMERIC_INPUT} from "../../../../../components/input/textfield/TextField";
import {DateTimeInput} from "../../../../../components/input/datetime/DateTimeInput";

interface MetadataListEntryProps {
	entry: AttributeDTO,
	shortName: string,
	onUpdateValue: (prev: AttributeValueDTO, next: AttributeValueDTO) => void,
	onContextMenu: (attributeKey: string, event: React.MouseEvent) => void,
}


export function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

	return (
		<KeyValuePair
			keyValue={props.shortName}
			styleType="focus-key"
			onContextMenu={event => props.onContextMenu(props.entry.key, event)}
			showOverflow={props.entry.type === "date"}
		>
			{renderInputField()}
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

	function renderInputList(): ReactElement {
		return null; // todo
	}

	function handleUpdateValue(value: AttributeValueDTO): void {
		props.onUpdateValue(props.entry.value, value);
	}

}
