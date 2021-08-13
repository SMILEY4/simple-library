import React, {ReactElement} from "react";
import {ElementLabel} from "../../../../../components/misc/elementlabel/ElementLabel";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../components/buttons/choicebox/ChoiceBox";
import {renamePartTypeAllowsUserInput} from "../../../../common/utils";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {BaseElementFlat} from "../../../../../components/base/element/BaseElementFlat";
import {Label} from "../../../../../components/base/label/Label";
import {RenamePartDTO, RenamePartTypeDTO} from "../../../../../../common/events/dtoModels";

const CB_ITEMS_RENAME_PART_TYPES: ChoiceBoxItem[] = [
	{
		id: "nothing",
		text: "Nothing"
	},
	{
		id: "text",
		text: "Text"
	},
	{
		id: "number_from",
		text: "Number from"
	},
	{
		id: "original_filename",
		text: "Filename"
	},
]

interface ImportRenameFilesFormProps {
	rename: boolean,
	onRename: (rename: boolean) => void

	renameParts: RenamePartDTO[]
	sampleFile: string | null,

	errorTypes?: boolean,
	errorValues?: boolean[]

	onSelectType: (index: number, type: RenamePartTypeDTO) => void,
	onChangeValue: (index: number, value: string) => void,
	onSelectValue: (index: number, value: string) => void,

}

export function ImportRenameFilesForm(props: React.PropsWithChildren<ImportRenameFilesFormProps>): React.ReactElement {

	return (
		<BaseElementFlat allowOverflow>
			<VBox alignMain="center" alignCross="start" spacing="0-5" padding="0-5">

				<CheckBox selected={props.rename} onToggle={props.onRename}>Rename Files</CheckBox>

				<HBox>
					{props.renameParts.map((part: RenamePartDTO, index: number) => renderRenamePart(part, index))}
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

	function filenamePreview(renameParts: RenamePartDTO[], index: number): string {
		const orgFilename: string = props.sampleFile
			? props.sampleFile.replace(/^.*[\\\/]/, "").split(".")[0]
			: "filename"
		const fileExtension: string = props.sampleFile
			? props.sampleFile.replace(/^.*[\\\/]/, "").split(".")[1]
			: ".xyz"
		let previewFilename: string = "";
		renameParts.forEach(part => {
			switch (part.type) {
				case "nothing":
					break;
				case "text":
					previewFilename += part.value;
					break;
				case "number_from":
					previewFilename += isNaN(parseInt(part.value)) ? "" : parseInt(part.value) + index;
					break;
				case "original_filename":
					previewFilename += orgFilename;
					break;

			}
		});
		return previewFilename + "." + fileExtension;
	}


	function renderRenamePart(part: RenamePartDTO, index: number): ReactElement {
		const groupPos = index === 0 ? "left" : (index + 1 === props.renameParts.length ? "right" : "center")
		return (
			<VBox alignCross="stretch" key={index}>
				<ChoiceBox
					items={CB_ITEMS_RENAME_PART_TYPES}
					selectedItemId={part.type}
					onAction={(itemId: string) => props.onSelectType(index, itemId as RenamePartTypeDTO)}
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

}
