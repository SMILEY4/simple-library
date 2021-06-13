import React from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../Application";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Label} from "../../../../components/base/label/Label";
import {useGroups} from "../../../hooks/base/groupHooks";
import {TextField} from "../../../../components/input/textfield/TextField";
import {useValidatedState} from "../../../../components/utils/commonHooks";

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
		triggerNameValidation,
		refName,
		refNameValid,
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
					<Label type="caption" variant="secondary">Group Name:</Label>
					<TextField
						autofocus
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
		if (refNameValid.current) {
			if (refName.current !== prevName) {
				renameGroup(props.groupId, refName.current);
			}
			props.onClose();
		}
	}

	function validateName(newName: string): boolean {
		return newName.trim().length > 0
	}

}
