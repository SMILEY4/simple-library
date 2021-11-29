import React from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import "./panelListAppearance.css";
import {AttributeMetaSelectionList} from "./AttributeMetaSelectionList";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {Icon, IconType} from "../../../../../components/base/icon/Icon";
import {Button} from "../../../../../components/buttons/button/Button";


interface PanelListAppearanceProps {
	entries: AttributeMetaDTO[],
	onAddEntry: (e: AttributeMetaDTO) => void,
	onDeleteEntry: (e: AttributeMetaDTO) => void,
	onMoveEntryUp: (e: AttributeMetaDTO) => void,
	onMoveEntryDown: (e: AttributeMetaDTO) => void
}

export function PanelListAppearance(props: React.PropsWithChildren<PanelListAppearanceProps>): React.ReactElement {


	return (
		<HBox spacing="0-5" alignMain="space-between" alignCross="start" className="list-appearance-base">
			<AttributeMetaSelectionList onSelect={onAddNewEntry}/>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="list-appearance-selected">
				{props.entries.map((e, index) => renderEntry(e, index))}
			</VBox>
		</HBox>
	);

	function renderEntry(entry: AttributeMetaDTO, index: number) {
		return (
			<VBox spacing="0-5" padding="0-25" alignMain="start" alignCross="stretch" className="list-appearance-entry" key={entry.attId}>

				<HBox spacing="0-25" alignMain="space-between" alignCross="center" key={entry.attId}>
					<VBox alignCross="start" alignMain="center">
						<Label overflow="cutoff">
							{entry.key.name}
						</Label>
						<Label type="caption" variant="secondary" overflow="cutoff">
							{entry.key.g0 + ", " + entry.key.g1 + ", " + entry.key.g2}
						</Label>
					</VBox>
					<IconButton ghost icon={IconType.CLOSE} onAction={() => onDeleteEntry(entry)}/>
				</HBox>

				<HBox alignCross="center" spacing="0-5" className={"list-appearance-entry-content"}>
					<Button onAction={() => onMoveEntryUp(entry)} disabled={index === 0}>
						Move Up
						<Icon type={IconType.CHEVRON_UP}/>
					</Button>
					<Button onAction={() => onMoveEntryDown(entry)} disabled={index === props.entries.length - 1}>
						Move Down
						<Icon type={IconType.CHEVRON_DOWN}/>
					</Button>
				</HBox>

			</VBox>
		);
	}

	function onAddNewEntry(attributeMeta: AttributeMetaDTO) {
		props.onAddEntry(attributeMeta);
	}

	function onDeleteEntry(attributeMeta: AttributeMetaDTO) {
		props.onDeleteEntry(attributeMeta);
	}

	function onMoveEntryUp(attributeMeta: AttributeMetaDTO) {
		props.onMoveEntryUp(attributeMeta);
	}

	function onMoveEntryDown(attributeMeta: AttributeMetaDTO) {
		props.onMoveEntryDown(attributeMeta);
	}

}
