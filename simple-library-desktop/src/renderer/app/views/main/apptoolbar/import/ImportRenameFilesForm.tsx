import React, {ReactElement} from "react";
import {ElementLabel} from "../../../../../newcomponents/misc/elementlabel/ElementLabel";
import {HBox, VBox} from "../../../../../newcomponents/layout/box/Box";
import {CheckBox} from "../../../../../newcomponents/buttons/checkbox/CheckBox";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../newcomponents/buttons/choicebox/ChoiceBox";
import {RenamePartType, renamePartTypeAllowsUserInput} from "../../../../../../common/commonModels";
import {TextField} from "../../../../../newcomponents/input/textfield/TextField";
import {LabelBox} from "../../../../../newcomponents/base/labelbox/LabelBox";
import {BaseElementFlat} from "../../../../../newcomponents/base/element/BaseElementFlat";

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

	types: RenamePartType[],
	values: (string | null)[]

	errorTypes: boolean,
	errorValues: boolean[]

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
					{props.types.map((type: RenamePartType, index: number) => renderRenamePart(type, props.values[index], props.errorValues[index], index))}
				</HBox>

				<ElementLabel text={"Preview:"}>
					<LabelBox italic disabled={!props.rename}>
						img20200612.jpg
					</LabelBox>
				</ElementLabel>

			</VBox>
		</BaseElementFlat>
	);


	function renderRenamePart(type: RenamePartType, value: string | null, errorValue: boolean, index: number): ReactElement {
		const groupPos = index === 0 ? "left" : (index + 1 === props.types.length ? "right" : "center")
		return (
			<VBox alignCross="stretch" key={index}>
				<ChoiceBox
					items={CB_ITEMS_RENAME_PART_TYPES}
					selectedItemId={type}
					onAction={(itemId: string) => props.onSelectType(index, idToType(itemId))}
					disabled={!props.rename}
					groupPos={groupPos}
					error={props.errorTypes}
				/>
				<TextField
					value={value ? value : ""}
					forceState
					onAccept={(value: string) => props.onSelectValue(index, value)}
					onChange={(value: string) => props.onChangeValue(index, value)}
					error={errorValue}
					disabled={!props.rename || !renamePartTypeAllowsUserInput(type)}
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
