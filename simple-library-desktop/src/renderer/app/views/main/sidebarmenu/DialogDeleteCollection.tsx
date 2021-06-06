import React from "react";
import {Dialog} from "../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {Button} from "../../../../newcomponents/buttons/button/Button";
import {Label} from "../../../../newcomponents/base/label/Label";
import {useCollections} from "../../../hooks/collectionHooks";

interface DialogDeleteCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogDeleteCollection(props: React.PropsWithChildren<DialogDeleteCollectionProps>): React.ReactElement {

	const {
		findCollection,
		deleteCollection
	} = useCollections();

	return (
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
						collection <b>{findCollection(props.collectionId).name}</b>?
					</Label>
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
		deleteCollection(props.collectionId)
		props.onClose();
	}

}
