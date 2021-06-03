import React from "react";
import {Dialog} from "../../../newcomponents/modals/dialog/Dialog";
import {Slot} from "../../../newcomponents/base/slot/Slot";
import {Button} from "../../../newcomponents/buttons/button/Button";
import {TextField} from "../../../newcomponents/input/textfield/TextField";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {DirectoryField} from "../../../newcomponents/input/directoryinputfield/DirectoryField";
import {useValidatedState} from "../../hooks/miscAppHooks";

const electron = window.require('electron');

interface DialogCreateLibraryProps {
	onCancel: () => void,
	onCreate: (name: string, targetDir: string) => void
}

export function DialogCreateLibrary(props: React.PropsWithChildren<DialogCreateLibraryProps>): React.ReactElement {

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation
	] = useValidatedState("", true, validateName)

	const [
		targetDir,
		setTargetDir,
		targetDirValid,
		triggerTargetDirValidation
	] = useValidatedState("", true, validateTargetDir)

	return (
		<Dialog
			show={true}
			icon={undefined}
			title={"Create New Library"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleCreate}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<TextField
						placeholder={"Name"}
						autofocus
						error={!nameValid}
						onAccept={setName}
					/>
					<DirectoryField
						placeholder={"Target Directory"}
						error={!targetDirValid}
						onBrowse={handleBrowseTarget}
						onSelect={setTargetDir}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleCreate} variant="info">Create</Button>
			</Slot>
		</Dialog>
	);

	function handleBrowseTarget(): Promise<string | null> {
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

	function handleCancel(): void {
		props.onCancel()
	}

	function handleCreate(): void {
		triggerNameValidation();
		triggerTargetDirValidation();
		if (nameValid && targetDirValid) {
			props.onCreate(name, targetDir)
		}
	}

	function validateName(name: string): boolean {
		return name && name.trim().length > 0
	}

	function validateTargetDir(targetDir: string): boolean {
		return targetDir && targetDir.trim().length > 0
	}

}
