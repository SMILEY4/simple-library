import React from "react";
import {Dialog} from "../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../Application";
import {Slot} from "../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../components/layout/box/Box";
import {Button} from "../../../../../components/buttons/button/Button";
import {Label} from "../../../../../components/base/label/Label";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {useDialogGroupEdit} from "../../../../hooks/app/sidebarmenu/useDialogGroupEdit";

interface DialogEditGroupProps {
	groupId: number,
	onClose: () => void,
}

export function DialogEditGroup(props: React.PropsWithChildren<DialogEditGroupProps>): React.ReactElement {

	const {
		getName,
		setName,
		isNameValid,
		handleCancel,
		handleEdit
	} = useDialogGroupEdit(props.groupId, props.onClose);

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Rename Group"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleEdit}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-25">
					<Label type="caption" variant="secondary">Group Name:</Label>
					<TextField
						autofocus
						placeholder={"Group Name"}
						value={getName()}
						onAccept={setName}
						error={!isNameValid()}
						onChange={(value: string) => !isNameValid() && setName(value)}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!isNameValid()} onAction={handleEdit}>Save</Button>
			</Slot>
		</Dialog>
	);

}
