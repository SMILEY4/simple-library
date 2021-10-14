import React, {ReactElement} from "react";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";
import {AttributeDTO, AttributeKeyDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";
import {Label} from "../../../../../components/base/label/Label";

interface MetadataListEntryProps {
	isEmpty?: boolean,
	entry: AttributeDTO,
	shortName: string,
	keyDisplayLength?: number,
	styleType?: "focus-key" | "focus-value",
	onUpdateValue: (prev: AttributeValueDTO, next: AttributeValueDTO) => void,
	onContextMenu?: (attributeKey: AttributeKeyDTO, event: React.MouseEvent) => void,
}


export function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

	return (
		<KeyValuePair
			keyValue={props.shortName}
			styleType={props.styleType ? props.styleType : "focus-key"}
			onContextMenu={event => props.onContextMenu && props.onContextMenu(props.entry.key, event)}
			showOverflow={props.entry.type === "date"}
			keySize={props.keyDisplayLength}
			modified={props.entry.modified}
		>
			{props.isEmpty === true
				? <Label overflow="nowrap-hidden" italic disabled>none</Label>
				: renderInputField(props.entry)}
		</KeyValuePair>
	);

	function renderInputField(attribute: AttributeDTO): ReactElement {
		if (attribute.writable) {
			return renderInputText(attribute);
		} else {
			return renderReadOnly(attribute);
		}
		// TODO: types
		// switch (props.entry.type) {
		// 	case "text":
		// 		return renderInputText();
		// 	case "number":
		// 		return renderInputNumber();
		// 	case "boolean":
		// 		return renderInputBoolean();
		// 	case "date":
		// 		return renderInputDate();
		// 	case "list":
		// 		return renderInputList();
		// }
	}

	function renderInputText(attribute: AttributeDTO): ReactElement {
		return (
			<ToggleTextField
				fillWidth
				underline
				value={attribute.value as string}
				onAccept={handleUpdateValue}
			/>
		);
	}

	function renderReadOnly(attribute: AttributeDTO): ReactElement {
		return <Label overflow="nowrap-hidden">{attribute.value}</Label>;
	}

	//
	// function renderInputNumber(): ReactElement {
	// 	return (
	// 		<ToggleTextField
	// 			fillWidth
	// 			regexChange={NUMERIC_INPUT}
	// 			regexAccept={NUMERIC_INPUT}
	// 			value={(props.entry.value as number).toString()}
	// 			onAccept={handleUpdateValue}
	// 		/>
	// 	);
	// }
	//
	// function renderInputBoolean(): ReactElement {
	// 	return (
	// 		<CheckBox
	// 			selected={props.entry.value as boolean}
	// 			onToggle={(selected: boolean) => handleUpdateValue(selected)}
	// 		/>
	// 	);
	// }
	//
	// function renderInputDate(): ReactElement {
	// 	if (isNaN((props.entry.value as Date).getTime())) {
	// 		return renderInvalid();
	// 	} else {
	// 		return (
	// 			<DateTimeInput
	// 				value={props.entry.value as Date}
	// 				onAccept={value => handleUpdateValue(value)}
	// 				showTimeSelect
	// 				toggleInputField
	// 				labelFillWidth
	// 			/>
	// 		);
	// 	}
	// }
	//
	// function renderInputList(): ReactElement {
	// 	return (
	// 		<ListInputField
	// 			listName={props.entry.key}
	// 			initItems={props.entry.value as string[]}
	// 			onSave={value => handleUpdateValue(value)}
	// 			fillWidth
	// 		/>
	// 	);
	// }
	//
	// function renderInvalid(): ReactElement {
	// 	return <Label overflow="nowrap-hidden" italic disabled>invalid</Label>;
	// }

	function handleUpdateValue(value: AttributeValueDTO): void {
		props.onUpdateValue(props.entry.value, value);
	}

}
