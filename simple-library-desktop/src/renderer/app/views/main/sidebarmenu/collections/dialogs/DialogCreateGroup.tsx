import React from "react";
import {Slot} from "../../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../../components/layout/box/Box";
import {Button} from "../../../../../../components/buttons/button/Button";
import {Label} from "../../../../../../components/base/label/Label";
import {TextField} from "../../../../../../components/input/textfield/TextField";
import {Spacer} from "../../../../../../components/base/spacer/Spacer";
import {useDialogGroupCreate} from "./useDialogGroupCreate";
import {Card} from "../../../../../../components/layout/card/Card";

interface DialogCreateGroupProps {
	parentGroupId: number | null,
	onClose: () => void,
}

export function DialogCreateGroup(props: React.PropsWithChildren<DialogCreateGroupProps>): React.ReactElement {

	const {
		parentName,
		setName,
		isNameValid,
		handleCreate,
		handleCancel
	} = useDialogGroupCreate(props.parentGroupId, props.onClose)

	return (
		<Card
			title={"Create Group"}
			subtitle={props.parentGroupId ? "Create in '" + parentName + "'" : undefined}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-25">
					<Label type="caption" variant="secondary">Group Name:</Label>
					<TextField
						autofocus
						placeholder={"Group Name"}
						value={name}
						onAccept={setName}
						error={!isNameValid()}
						onChange={(value: string) => !isNameValid() && setName(value)}
					/>
					{props.parentGroupId !== null && (
						<>
							<Spacer size="0-5" dir="horizontal" line/>
							<Label type="body" variant="primary">{"Create in '" + parentName + "'"}</Label>
						</>
					)}
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!isNameValid()} onAction={handleCreate}>Create</Button>
			</Slot>
		</Card>
	);

}
