import React from "react";
import {Slot} from "../../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../../components/layout/box/Box";
import {Button} from "../../../../../../components/buttons/button/Button";
import {Label} from "../../../../../../components/base/label/Label";
import {useDialogCollectionDelete} from "./useDialogCollectionDelete";
import {Card} from "../../../../../../components/layout/card/Card";

interface DialogDeleteCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogDeleteCollection(props: React.PropsWithChildren<DialogDeleteCollectionProps>): React.ReactElement {

	const {
		collectionName,
		handleCancel,
		handleDelete
	} = useDialogCollectionDelete(props.collectionId, props.onClose)

	return collectionName && (
		<Card
			title={"Delete Collection"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label>
						Are you sure sure you want to delete the
						collection <b>{collectionName}</b>?
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
