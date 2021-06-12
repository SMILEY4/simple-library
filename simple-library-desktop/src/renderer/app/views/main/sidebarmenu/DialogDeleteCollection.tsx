import React from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Label} from "../../../../components/base/label/Label";
import {useCollections} from "../../../hooks/collectionHooks";
import {useGroups} from "../../../hooks/groupHooks";
import {useItemSelection} from "../../../hooks/itemHooks";
import {Collection} from "../../../../../common/commonModels";

interface DialogDeleteCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogDeleteCollection(props: React.PropsWithChildren<DialogDeleteCollectionProps>): React.ReactElement {

	const {
		activeCollectionId,
		findCollection,
		deleteCollection
	} = useCollections();

	const {
		loadGroups
	} = useGroups()

	const {
		clearSelection
	} = useItemSelection()

	const collection: Collection | null = findCollection(props.collectionId);

	return collection && (
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
						collection <b>{collection.name}</b>?
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
			.then(() => loadGroups())
			.then(() => {
				if (activeCollectionId === props.collectionId) {
					clearSelection()
				}
			})
			.then(() => props.onClose())
	}

}
