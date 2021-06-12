import React from "react";
import {HBox, VBox} from "../../../../../newcomponents/layout/box/Box";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../newcomponents/buttons/choicebox/ChoiceBox";
import {DirectoryInputField} from "../../../../../newcomponents/input/directoryinputfield/DirectoryInputField";
import {ImportTargetAction} from "../../../../../../common/commonModels";
import {BaseElementFlat} from "../../../../../newcomponents/base/element/BaseElementFlat";

const electron = window.require('electron');

const CB_ITEMS_FILE_TARGET_TYPES: ChoiceBoxItem[] = [
	{
		id: ImportTargetAction.KEEP,
		text: "Keep in directory"
	},
	{
		id: ImportTargetAction.MOVE,
		text: "Move to target directory"
	},
	{
		id: ImportTargetAction.COPY,
		text: "Copy to target directory"
	},
]


interface ImportTargetDirFormProps {
	error: boolean
	targetType: string,
	onSetTargetType: (type: ImportTargetAction) => void,
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
					disabled={props.targetType === ImportTargetAction.KEEP}
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
