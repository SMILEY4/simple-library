import React, {ReactElement} from "react";
import {AttributeDTO, AttributeKeyDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";
import {Label} from "../../../../../components/base/label/Label";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";
import {MultiTypeInput} from "../../../../../components/input/multitype/MultiTypeInput";

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
			switch (attribute.type) {
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
			<MultiTypeInput
				type="text"
				value={attribute.value}
				onAccept={handleUpdateValue}
			/>
		);
	}


	function renderInputNumber(attribute: AttributeDTO): ReactElement {
		return (
			<MultiTypeInput
				type="number"
				value={attribute.value}
				onAccept={handleUpdateValue}
			/>
		);
	}


	function renderInputBoolean(attribute: AttributeDTO): ReactElement {
		return (
			<CheckBox
				selected={attribute.value.toLowerCase() === "true"}
				onToggle={(selected: boolean) => handleUpdateValue(selected ? "true" : "false")}
			/>
		);
	}


	function renderInputDate(attribute: AttributeDTO): ReactElement {
		return (
			<MultiTypeInput
				type="date"
				value={attribute.value}
				onAccept={handleUpdateValue}
			/>
		);
	}


	function handleUpdateValue(value: AttributeValueDTO): void {
		props.onUpdateValue(props.entry.value, value);
	}

}
