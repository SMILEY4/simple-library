import React from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Label} from "../../../../components/base/label/Label";
import {useGroups} from "../../../hooks/groupHooks";
import {TextField} from "../../../../components/input/textfield/TextField";
import {useValidatedState} from "../../../hooks/miscHooks";
import {Group} from "../../../../../common/commonModels";
import {Spacer} from "../../../../components/base/spacer/Spacer";

interface DialogCreateGroupProps {
	parentGroupId: number | null,
	onClose: () => void,
}

export function DialogCreateGroup(props: React.PropsWithChildren<DialogCreateGroupProps>): React.ReactElement {

	const {
		findGroup,
		createGroup
	} = useGroups();

	const parentGroup: Group | null = findGroup(props.parentGroupId)

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation,
		refName,
		refNameValid,
	] = useValidatedState("", true, validateName)

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Create Group"}
			subtitle={props.parentGroupId ? "Create in '" + parentGroup.name + "'" : undefined}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleCreate}
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
					{props.parentGroupId !== null && (
						<>
							<Spacer size="0-5" dir="horizontal" line/>
							<Label type="body" variant="primary">{"Create in '" + parentGroup.name + "'"}</Label>
						</>
					)}
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!nameValid} onAction={handleCreate}>Create</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleCreate() {
		triggerNameValidation();
		if (refNameValid.current) {
			createGroup(props.parentGroupId, refName.current);
			props.onClose();
		}
	}

	function validateName(newName: string): boolean {
		return newName.trim().length > 0
	}

}
