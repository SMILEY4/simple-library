import React, {ReactElement} from "react";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";
import {AttributeDTO, AttributeKeyDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";
import {Label} from "../../../../../components/base/label/Label";
import {NUMERIC_INPUT} from "../../../../../components/input/textfield/TextField";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";
import {DateTimeInput} from "../../../../../components/input/datetime/DateTimeInput";

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
			keyValue={props.shortName + " (" + props.entry.type.charAt(1) + ")"}
			styleType={props.styleType ? props.styleType : "focus-key"}
			onContextMenu={event => props.onContextMenu && props.onContextMenu(props.entry.key, event)}
			showOverflow={props.entry.type === "_date"}
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
			switch (props.entry.type) {
				case "_text":
					return renderInputText(attribute);
				case "_number":
					return renderInputNumber(attribute);
				case "_boolean":
					return renderInputBoolean(attribute);
				case "_date":
					return renderInputDate(attribute);
				default:
					return renderInputText(attribute);
			}
		} else {
			return renderReadOnly(attribute);
		}
	}


	function renderReadOnly(attribute: AttributeDTO): ReactElement {
		return <Label overflow="nowrap-hidden">{attribute.value}</Label>;
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

	function renderInputNumber(attribute: AttributeDTO): ReactElement {
		return (
			<ToggleTextField
				fillWidth
				underline
				regexChange={NUMERIC_INPUT}
				regexAccept={NUMERIC_INPUT}
				value={(Number(attribute.value)).toString()}
				onAccept={handleUpdateValue}
			/>
		);
	}

	function renderInputBoolean(attribute: AttributeDTO): ReactElement {
		return (
			<CheckBox
				selected={attribute.value.toLowerCase() === "true"}
				onToggle={(selected: boolean) => handleUpdateValue(selected)}
			/>
		);
	}

	function renderInputDate(attribute: AttributeDTO): ReactElement {
		if (isNaN(new Date(Date.parse(attribute.value)).getTime())) {
			return renderInvalid();
		} else {
			return (
				<DateTimeInput
					value={new Date(Date.parse(attribute.value))}
					onAccept={value => handleUpdateValue(value)}
					showTimeSelect
					toggleInputField
					labelFillWidth
					underline
				/>
			);
		}
	}

	function renderInvalid(): ReactElement {
		return <Label overflow="nowrap-hidden" italic disabled>invalid</Label>;
	}

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

	function handleUpdateValue(value: AttributeValueDTO): void {
		props.onUpdateValue(props.entry.value, value);
	}

}
