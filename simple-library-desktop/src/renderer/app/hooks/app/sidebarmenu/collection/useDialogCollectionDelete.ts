import {useDialogController} from "../../miscApplicationHooks";
import {useState} from "react";
import {
	useCollections,
	useCollectionsState,
} from "../../../base/collectionHooks";
import {useActiveCollectionState} from "../../../base/activeCollectionHooks";
import {useItemSelection} from "../../../base/itemSelectionHooks";
import {CollectionDTO} from "../../../../../../common/messaging/dtoModels";

export function useDialogCollectionDeleteController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

	const [show, open, close] = useDialogController();
	const [id, setId] = useState<number | null>(null)

	function openDialog(id: number | null): void {
		if (id) {
			setId(id)
			open()
		}
	}

	function closeDialog(): void {
		close()
		setId(null)
	}

	return [show, openDialog, closeDialog, id]
}


export function useDialogCollectionDelete(collectionId: number, onFinished: (deleted: boolean) => void) {

	const {
		loadGroups,
		deleteCollection
	} = useCollections();

	const {
		findCollection,
	} = useCollectionsState();


	const {
		activeCollectionId,
	} = useActiveCollectionState();


	const {
		clearSelection
	} = useItemSelection()

	const collection: CollectionDTO | null = findCollection(collectionId);

	function handleCancel() {
		onFinished(false)
	}

	function handleDelete() {
		deleteCollection(collectionId)
			.then(() => loadGroups())
			.then(() => {
				if (activeCollectionId === collectionId) {
					clearSelection()
				}
			})
			.then(() => onFinished(true))
	}

	return {
		collectionName: collection ? collection.name : null,
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}
}
