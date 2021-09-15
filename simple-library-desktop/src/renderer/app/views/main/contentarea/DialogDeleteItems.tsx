import React from "react";
import {useDialogItemsDelete} from "./useDialogItemsDelete";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Label} from "../../../../components/base/label/Label";
import {Button} from "../../../../components/buttons/button/Button";
import {Card} from "../../../../components/layout/card/Card";

interface DialogDeleteItemsProps {
	itemIds: number[],
	activeCollectionId: number,
	onClose: () => void,
}

export function DialogDeleteItems(props: React.PropsWithChildren<DialogDeleteItemsProps>): React.ReactElement {

	const {
		handleCancel,
		handleDelete,
	} = useDialogItemsDelete(props.itemIds, props.activeCollectionId, props.onClose)

	return (
		<Card
			title={"Delete Group"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label>
						Are you sure sure you want to permanently delete <b>{props.itemIds.length}</b> items?
					</Label>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleDelete} variant="error">Delete</Button>
			</Slot>
		</Card>
	);

}
