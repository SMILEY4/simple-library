import React from "react";
import {Dialog} from "../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../Application";
import {Slot} from "../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../components/layout/box/Box";
import {Button} from "../../../../../components/buttons/button/Button";
import {Label} from "../../../../../components/base/label/Label";
import {useDialogCollectionDelete} from "../../../../hooks/app/sidebarmenu/collection/useDialogCollectionDelete";

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
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Delete Collection"}
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
						Are you sure sure you want to delete the
						collection <b>{collectionName}</b>?
					</Label>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleDelete} variant="error">Delete</Button>
			</Slot>
		</Dialog>
	);

}
