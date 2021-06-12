import React from "react";
import {Dialog} from "../../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../application";
import {Slot} from "../../../../../newcomponents/base/slot/Slot";
import {Button} from "../../../../../newcomponents/buttons/button/Button";
import {useItems} from "../../../../hooks/itemHooks";
import {HBox, VBox} from "../../../../../newcomponents/layout/box/Box";
import {FileInputField} from "../../../../../newcomponents/input/fileinputfield/FileInputField";
import {useValidatedState} from "../../../../hooks/miscHooks";
import {Spacer} from "../../../../../newcomponents/base/spacer/Spacer";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../newcomponents/buttons/choicebox/ChoiceBox";
import {ImportTargetAction, RenamePartType} from "../../../../../../common/commonModels";
import {useStateRef} from "../../../../../components/common/commonHooks";
import {DirectoryInputField} from "../../../../../newcomponents/input/directoryinputfield/DirectoryInputField";
import {ElementLabel} from "../../../../../newcomponents/misc/elementlabel/ElementLabel";
import {CheckBox} from "../../../../../newcomponents/buttons/checkbox/CheckBox";
import {Grid} from "../../../../../newcomponents/layout/grid/Grid";
import {TextField} from "../../../../../newcomponents/input/textfield/TextField";
import {LabelBox} from "../../../../../newcomponents/base/labelbox/LabelBox";

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

interface DialogImportFilesProps {
	onClose: () => void,
}

export function DialogImportFiles(props: React.PropsWithChildren<DialogImportFilesProps>): React.ReactElement {

	const {
		importItems
	} = useItems()

	const [
		files,
		setFiles,
		filesValid,
		triggerFileValidation,
		refFiles,
		refFilesValid
	] = useValidatedState<string[]>([], true, validateFiles)

	const [
		fileTargetType,
		setFileTargetType,
		refFileTargetType
	] = useStateRef<string>(ImportTargetAction.KEEP)

	const [
		targetDir,
		setTargetDir,
		targetDirValid,
		triggerTargetDirValidation,
		refTargetDir,
		refTargetDirValid
	] = useValidatedState<string | null>(null, true, validateTargetDir)

	const [
		renameFiles,
		setRenameFiles,
		refRenameFiles
	] = useStateRef(false)

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Import Files"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleImport}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="start" spacing="0-5">

					<ElementLabel text="Select files to import:">
						<FileInputField
							placeholder={"Files"}
							error={!filesValid}
							onBrowse={handleBrowseFiles}
							onSelect={setFiles}
						/>
					</ElementLabel>

					<Spacer size="0-5" dir="horizontal" line/>


					<HBox alignMain="start">
						<ChoiceBox
							items={CB_ITEMS_FILE_TARGET_TYPES}
							selectedItemId={fileTargetType}
							onAction={setFileTargetType}
						/>
					</HBox>
					<DirectoryInputField
						placeholder={"Target Directory"}
						error={!targetDirValid}
						onBrowse={browseTargetDir}
						onSelect={setTargetDir}
						disabled={fileTargetType === ImportTargetAction.KEEP}
					/>

					<Spacer size="0-5" dir="horizontal" line/>


					<CheckBox selected={renameFiles} onToggle={setRenameFiles}>Rename Files</CheckBox>

					<HBox spacing="0-25">

						<VBox alignCross="stretch">
							<ChoiceBox
								items={CB_ITEMS_RENAME_PART_TYPES}
								selectedItemId={RenamePartType.NOTHING}
								onAction={undefined}
							/>
							<TextField
								value={""}
								onAccept={undefined}
								error={undefined}
								onChange={undefined}
							/>
						</VBox>

						<VBox alignCross="stretch">
							<ChoiceBox
								items={CB_ITEMS_RENAME_PART_TYPES}
								selectedItemId={RenamePartType.NOTHING}
								onAction={undefined}
							/>
							<TextField
								value={""}
								onAccept={undefined}
								error={undefined}
								onChange={undefined}
							/>
						</VBox>

						<VBox alignCross="stretch">
							<ChoiceBox
								items={CB_ITEMS_RENAME_PART_TYPES}
								selectedItemId={RenamePartType.NOTHING}
								onAction={undefined}
							/>
							<TextField
								value={""}
								onAccept={undefined}
								error={undefined}
								onChange={undefined}
							/>
						</VBox>

					</HBox>

					<ElementLabel text={"Preview:"}>
						<LabelBox italic>img20200612.jpg</LabelBox>
					</ElementLabel>


				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={false} onAction={handleImport}>Import</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleImport() {
		triggerFileValidation();
		triggerTargetDirValidation();
		if (refFilesValid.current && refTargetDirValid.current) {
			importItems(null); // todo
			props.onClose();
		}
	}


	//==================//
	//   SELECT FILES   //
	//==================//

	function validateFiles(files: string[]): boolean {
		return files.length > 0;
	}

	function handleBrowseFiles(): Promise<string[] | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select Files',
				buttonLabel: 'Select',
				properties: [
					'openFile',
					'multiSelections',
					'dontAddToRecent',
				],
			})
			.then((result: any) => {
				if (result.canceled) {
					return null;
				} else {
					return result.filePaths;
				}
			});
	}

	//==================//
	//    TARGET DIR    //
	//==================//

	function validateTargetDir(targetDir: string | null): boolean {
		console.log("validate target dir", refFileTargetType.current, targetDir)
		if (refFileTargetType.current === ImportTargetAction.KEEP) {
			return true;
		} else {
			return targetDir && targetDir.trim().length > 0
		}
	}

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
