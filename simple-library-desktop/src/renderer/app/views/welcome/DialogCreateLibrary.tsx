import React from "react";
import {Slot} from "../../../components/base/slot/Slot";
import {Button} from "../../../components/buttons/button/Button";
import {TextField} from "../../../components/input/textfield/TextField";
import {VBox} from "../../../components/layout/box/Box";
import {DirectoryInputField} from "../../../components/input/directory/DirectoryInputField";
import {useDialogCreateLibrary} from "./useDialogCreateLibrary";
import {Card} from "../../../components/layout/card/Card";

interface DialogCreateLibraryProps {
	onFinished: (created: boolean) => void,
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
		<Card
			title={"Create New Library"}
			closable={true}
			onClose={cancel}
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
		</Card>
	);

}
