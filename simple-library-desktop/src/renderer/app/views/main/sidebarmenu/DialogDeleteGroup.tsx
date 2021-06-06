import React, {useState} from "react";
import {Dialog} from "../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {Button} from "../../../../newcomponents/buttons/button/Button";
import {Label} from "../../../../newcomponents/base/label/Label";
import {useGroups} from "../../../hooks/groupHooks";
import {CheckBox} from "../../../../newcomponents/buttons/checkbox/CheckBox";

interface DialogDeleteGroupProps {
	groupId: number,
	onClose: () => void,
}

export function DialogDeleteGroup(props: React.PropsWithChildren<DialogDeleteGroupProps>): React.ReactElement {

	const {
		findGroup,
		deleteGroup
	} = useGroups();

	const [keepContent, setKeepContent] = useState(false)

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Delete Group"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleDelete}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label>
						Are you sure sure you want to delete the group <b>{findGroup(props.groupId).name}</b>?
					</Label>
					<CheckBox selected={keepContent} onToggle={setKeepContent}>Keep content of group</CheckBox>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleDelete} variant="error">Delete</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleDelete() {
		deleteGroup(props.groupId, keepContent)
		props.onClose();
	}

}
