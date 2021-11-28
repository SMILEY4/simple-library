import React from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import "./panelDefaultAttributeValues.css";
import {AttributeMetaSelectionList} from "./AttributeMetaSelectionList";
import {AttributeMetaDTO, DefaultAttributeValueEntryDTO} from "../../../../../../common/events/dtoModels";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../../components/base/icon/Icon";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";


interface PanelDefaultAttributeValuesProps {
	defaultAttributeValues: DefaultAttributeValueEntryDTO[];
	onSetDefaultAttributeValue: (entry: DefaultAttributeValueEntryDTO) => void;
	onDeleteDefaultAttributeValue: (attId: number) => void;
}

export function PanelDefaultAttributeValues(props: React.PropsWithChildren<PanelDefaultAttributeValuesProps>): React.ReactElement {

	return (
		<HBox spacing="0-5" alignMain="space-between" alignCross="start" className="default-attrib-values-base">
			<AttributeMetaSelectionList onSelect={onAddNewDefaultValue}/>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="default-attrib-values-selected">
				{props.defaultAttributeValues.map(e => renderEntry(e))}
			</VBox>
		</HBox>
	);

	function renderEntry(entry: DefaultAttributeValueEntryDTO) {
		return (
			<VBox spacing="0-5" padding="0-25" alignMain="start" alignCross="stretch" className="attrib-value-entry" key={entry.attributeMeta.attId}>

				<HBox spacing="0-25" alignMain="space-between" alignCross="center" key={entry.attributeMeta.attId}>
					<VBox alignCross="start" alignMain="center">
						<Label overflow="cutoff">
							{entry.attributeMeta.key.name}
						</Label>
						<Label type="caption" variant="secondary" overflow="cutoff">
							{entry.attributeMeta.key.g0 + ", " + entry.attributeMeta.key.g1 + ", " + entry.attributeMeta.key.g2}
						</Label>
					</VBox>
					<IconButton ghost icon={IconType.CLOSE} onAction={() => onDeleteDefaultValueEntry(entry.attributeMeta.attId)}/>
				</HBox>

				<VBox alignCross="start" spacing="0-25" className={"attrib-value-entry-content"}>
					<HBox spacing="0-25">
						<Label>Value:</Label>
						<TextField
							placeholder={"Default Value"}
							value={entry.defaultValue}
							onAccept={value => onSetValue(entry, value)}
							onChange={value => onSetValue(entry, value)}
						/>
					</HBox>

					<CheckBox
						selected={entry.allowOverwrite}
						onToggle={(selected) => onSetOverwrite(entry, selected)}
						forceState
					>
						Overwrite
					</CheckBox>
				</VBox>

			</VBox>
		);
	}

	function onSetValue(entry: DefaultAttributeValueEntryDTO, value: string) {
		onSetDefaultValueEntry({
			attributeMeta: entry.attributeMeta,
			defaultValue: value,
			allowOverwrite: entry.allowOverwrite
		});
	}

	function onSetOverwrite(entry: DefaultAttributeValueEntryDTO, overwrite: boolean) {
		onSetDefaultValueEntry({
			attributeMeta: entry.attributeMeta,
			defaultValue: entry.defaultValue,
			allowOverwrite: overwrite
		});
	}

	function onAddNewDefaultValue(attributeMeta: AttributeMetaDTO) {
		const entry: DefaultAttributeValueEntryDTO = {
			attributeMeta: attributeMeta,
			defaultValue: "",
			allowOverwrite: false
		};
		onSetDefaultValueEntry(entry);
	}

	function onSetDefaultValueEntry(entry: DefaultAttributeValueEntryDTO) {
		props.onSetDefaultAttributeValue(entry);
	}

	function onDeleteDefaultValueEntry(attId: number) {
		props.onDeleteDefaultAttributeValue(attId);
	}

}
