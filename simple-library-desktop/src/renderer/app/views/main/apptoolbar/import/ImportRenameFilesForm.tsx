import React, {ReactElement} from "react";
import {ElementLabel} from "../../../../../newcomponents/misc/elementlabel/ElementLabel";
import {HBox, VBox} from "../../../../../newcomponents/layout/box/Box";
import {CheckBox} from "../../../../../newcomponents/buttons/checkbox/CheckBox";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../newcomponents/buttons/choicebox/ChoiceBox";
import {RenamePart, RenamePartType, renamePartTypeAllowsUserInput} from "../../../../../../common/commonModels";
import {TextField} from "../../../../../newcomponents/input/textfield/TextField";
import {BaseElementFlat} from "../../../../../newcomponents/base/element/BaseElementFlat";
import {Label} from "../../../../../newcomponents/base/label/Label";

const CB_ITEMS_RENAME_PART_TYPES: ChoiceBoxItem[] = [
	{
		id: RenamePartType.NOTHING,
		text: "Nothing"
	},
	{
		id: RenamePartType.TEXT,
		text: "Text"
	},
	{
		id: RenamePartType.NUMBER_FROM,
		text: "Number from"
	},
	{
		id: RenamePartType.ORIGINAL_FILENAME,
		text: "Filename"
	},
]

interface ImportRenameFilesFormProps {
	rename: boolean,
	onRename: (rename: boolean) => void

	renameParts: RenamePart[]
	sampleFile: string | null,

	errorTypes?: boolean,
	errorValues?: boolean[]

	onSelectType: (index: number, type: RenamePartType) => void,
	onChangeValue: (index: number, value: string) => void,
	onSelectValue: (index: number, value: string) => void,

}

export function ImportRenameFilesForm(props: React.PropsWithChildren<ImportRenameFilesFormProps>): React.ReactElement {

	return (
		<BaseElementFlat allowOverflow>
			<VBox alignMain="center" alignCross="start" spacing="0-5" padding="0-5">

				<CheckBox selected={props.rename} onToggle={props.onRename}>Rename Files</CheckBox>

				<HBox>
					{props.renameParts.map((part: RenamePart, index: number) => renderRenamePart(part, index))}
				</HBox>

				<ElementLabel text={"Preview:"}>
					<VBox spacing="0-25" style={{paddingLeft: "var(--s-0-5)"}} alignCross="start">
						<Label italic disabled={!props.rename}>{filenamePreview(props.renameParts, 0)}</Label>
						<Label italic disabled={!props.rename}>{filenamePreview(props.renameParts, 1)}</Label>
						<Label italic disabled={!props.rename}>...</Label>
					</VBox>
				</ElementLabel>

			</VBox>
		</BaseElementFlat>
	);

	function filenamePreview(renameParts: RenamePart[], index: number): string {
		const orgFilename: string = props.sampleFile
			? props.sampleFile.replace(/^.*[\\\/]/, "").split(".")[0]
			: "filename"
		const fileExtension: string = props.sampleFile
			? props.sampleFile.replace(/^.*[\\\/]/, "").split(".")[1]
			: ".xyz"
		let previewFilename: string = "";
		renameParts.forEach(part => {
			switch (part.type) {
				case RenamePartType.NOTHING:
					break;
				case RenamePartType.TEXT:
					previewFilename += part.value;
					break;
				case RenamePartType.NUMBER_FROM:
					previewFilename += isNaN(parseInt(part.value)) ? "" : parseInt(part.value) + index;
					break;
				case RenamePartType.ORIGINAL_FILENAME:
					previewFilename += orgFilename;
					break;

			}
		});
		return previewFilename + "." + fileExtension;
	}


	function renderRenamePart(part: RenamePart, index: number): ReactElement {
		const groupPos = index === 0 ? "left" : (index + 1 === props.renameParts.length ? "right" : "center")
		return (
			<VBox alignCross="stretch" key={index}>
				<ChoiceBox
					items={CB_ITEMS_RENAME_PART_TYPES}
					selectedItemId={part.type}
					onAction={(itemId: string) => props.onSelectType(index, idToType(itemId))}
					disabled={!props.rename}
					groupPos={groupPos}
					error={props.errorTypes}
				/>
				<TextField
					value={part.value}
					forceState
					onAccept={(value: string) => props.onSelectValue(index, value)}
					onChange={(value: string) => props.onChangeValue(index, value)}
					error={props.errorValues[index]}
					disabled={!props.rename || !renamePartTypeAllowsUserInput(part.type)}
					groupPos={groupPos}
				/>
			</VBox>
		)
	}

	function idToType(itemId: string): RenamePartType {
		switch (itemId) {
			case "" + RenamePartType.NOTHING: {
				return RenamePartType.NOTHING
			}
			case "" + RenamePartType.TEXT: {
				return RenamePartType.TEXT
			}
			case "" + RenamePartType.ORIGINAL_FILENAME: {
				return RenamePartType.ORIGINAL_FILENAME
			}
			case "" + RenamePartType.NUMBER_FROM: {
				return RenamePartType.NUMBER_FROM
			}
			default: {
				return RenamePartType.NOTHING
			}
		}
	}

}
