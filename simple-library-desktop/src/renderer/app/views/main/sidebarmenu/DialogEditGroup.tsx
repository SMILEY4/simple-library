import React from "react";
import {Dialog} from "../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {Button} from "../../../../newcomponents/buttons/button/Button";
import {Label} from "../../../../newcomponents/base/label/Label";
import {useGroups} from "../../../hooks/groupHooks";
import {TextField} from "../../../../newcomponents/input/textfield/TextField";
import {useValidatedState} from "../../../hooks/miscHooks";

interface DialogEditGroupProps {
	groupId: number,
	onClose: () => void,
}

export function DialogEditGroup(props: React.PropsWithChildren<DialogEditGroupProps>): React.ReactElement {

	const {
		findGroup,
		renameGroup
	} = useGroups();

	const prevName: string = findGroup(props.groupId).name;

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation
	] = useValidatedState(prevName, true, validateName)

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
					<Label type="caption" variant="secondary">New Name:</Label>
					<TextField
						placeholder={"Group Name"}
						value={name}
						onAccept={setName}
						error={!nameValid}
						onChange={(value: string) => !nameValid && setName(value)}
					/>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!nameValid} onAction={handleEdit}>Save</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleEdit() {
		triggerNameValidation();
		if (nameValid) {
			if (name !== prevName) {
				renameGroup(props.groupId, name);
			}
			props.onClose();
		}
	}

	function validateName(newName: string): boolean {
		return newName.trim().length > 0
	}

}
