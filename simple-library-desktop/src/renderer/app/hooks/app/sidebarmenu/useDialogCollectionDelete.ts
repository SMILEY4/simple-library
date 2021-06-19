import {useDialogController} from "../useDialogController";
import {useState} from "react";
import {useActiveCollection, useCollections, useCollectionsStateless} from "../../base/collectionHooks";
import {useItemSelection} from "../../base/itemHooks";
import {Collection} from "../../../../../common/commonModels";

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
		findCollection,
		loadGroups
	} = useCollections();

	const {
		activeCollectionId,
	} = useActiveCollection();

	const {
		deleteCollection
	} = useCollectionsStateless()

	const {
		clearSelection
	} = useItemSelection()

	const collection: Collection | null = findCollection(collectionId);

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
