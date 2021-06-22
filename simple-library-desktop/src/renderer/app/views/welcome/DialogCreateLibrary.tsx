import React from "react";
import {Dialog} from "../../../components/modals/dialog/Dialog";
import {Slot} from "../../../components/base/slot/Slot";
import {Button} from "../../../components/buttons/button/Button";
import {TextField} from "../../../components/input/textfield/TextField";
import {VBox} from "../../../components/layout/box/Box";
import {DirectoryInputField} from "../../../components/input/directoryinputfield/DirectoryInputField";
import {APP_ROOT_ID} from "../../Application";
import {useDialogCreateLibrary} from "../../hooks/app/welcome/useDialogCreateLibrary";

interface DialogCreateLibraryProps {
	onFinished: (created: boolean) => void
}

export function DialogCreateLibrary(props: React.PropsWithChildren<DialogCreateLibraryProps>): React.ReactElement {

	const {
		setName,
		isNameValid,
		setTargetDir,
		isTargetDirValid,
		browseTargetDir,
		create,
		cancel
	} = useDialogCreateLibrary(props.onFinished);

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Create New Library"}
			onClose={cancel}
			onEscape={cancel}
			onEnter={create}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<TextField
						placeholder={"Name"}
						autofocus
						error={!isNameValid()}
						onAccept={setName}
					/>
					<DirectoryInputField
						placeholder={"Target Directory"}
						error={!isTargetDirValid()}
						onBrowse={browseTargetDir}
						onSelect={setTargetDir}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={cancel}>Cancel</Button>
				<Button onAction={create} variant="info">Create</Button>
			</Slot>
		</Dialog>
	);

}
