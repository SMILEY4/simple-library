import React from "react";
import {Slot} from "../../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../../components/layout/box/Box";
import {Button} from "../../../../../../components/buttons/button/Button";
import {Label} from "../../../../../../components/base/label/Label";
import {CheckBox} from "../../../../../../components/buttons/checkbox/CheckBox";
import {useDialogGroupDelete} from "./useDialogGroupDelete";
import {Card} from "../../../../../../components/layout/card/Card";

interface DialogDeleteGroupProps {
	groupId: number,
	onClose: () => void,
}

export function DialogDeleteGroup(props: React.PropsWithChildren<DialogDeleteGroupProps>): React.ReactElement {

	const {
		groupName,
		isKeepContent,
		setKeepContent,
		handleCancel,
		handleDelete,
	} = useDialogGroupDelete(props.groupId, props.onClose)

	return groupName && (
		<Card
			title={"Delete Group"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label>
						Are you sure sure you want to delete the group <b>{groupName}</b>?
					</Label>
					<CheckBox selected={isKeepContent()} onToggle={setKeepContent}>Keep content of group</CheckBox>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleDelete} variant="error">Delete</Button>
			</Slot>
		</Card>
	);

}
