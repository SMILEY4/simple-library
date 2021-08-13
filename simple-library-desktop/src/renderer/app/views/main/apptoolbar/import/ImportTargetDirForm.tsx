import React from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../components/buttons/choicebox/ChoiceBox";
import {DirectoryInputField} from "../../../../../components/input/directoryinputfield/DirectoryInputField";
import {BaseElementFlat} from "../../../../../components/base/element/BaseElementFlat";
import {ImportTargetActionDTO} from "../../../../../../common/events/dtoModels";

const electron = window.require('electron');

const CB_ITEMS_FILE_TARGET_TYPES: ChoiceBoxItem[] = [
	{
		id: "keep",
		text: "Keep in directory"
	},
	{
		id: "move",
		text: "Move to target directory"
	},
	{
		id: "copy",
		text: "Copy to target directory"
	},
]


interface ImportTargetDirFormProps {
	error: boolean
	targetType: ImportTargetActionDTO,
	onSetTargetType: (type: ImportTargetActionDTO) => void,
	onSetTargetDir: (dir: string) => void
}

export function ImportTargetDirForm(props: React.PropsWithChildren<ImportTargetDirFormProps>): React.ReactElement {

	return (
		<BaseElementFlat allowOverflow>
			<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">
				<HBox alignMain="start">
					<ChoiceBox
						items={CB_ITEMS_FILE_TARGET_TYPES}
						selectedItemId={props.targetType}
						onAction={props.onSetTargetType}
					/>
				</HBox>
				<DirectoryInputField
					placeholder={"Target Directory"}
					error={props.error}
					onBrowse={browseTargetDir}
					onSelect={props.onSetTargetDir}
					disabled={props.targetType === "keep"}
				/>
			</VBox>
		</BaseElementFlat>
	);

	function browseTargetDir(): Promise<string | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select target directory',
				buttonLabel: 'Select',
				properties: [
					'openDirectory',
					'createDirectory',
				],
			})
			.then((result: any) => {
				if (result.canceled) {
					return null;
				} else {
					return result.filePaths[0];
				}
			});
	}

}
