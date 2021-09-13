import {useDialogController} from "../../../../../hooks/base/miscApplicationHooks";
import {useState} from "react";
import {useCollectionsState,} from "../../../../../hooks/base/collectionHooks";
import {CollectionDTO} from "../../../../../../../common/events/dtoModels";
import {useDeleteCollection} from "../../../../../hooks/logic/core/collectionDelete";

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


export function useDialogCollectionDelete(collectionId: number, onFinished: () => void) {

	const deleteCollection = useDeleteCollection();
	const {findCollection} = useCollectionsState();
	const collection: CollectionDTO | null = findCollection(collectionId);

	function handleCancel() {
		onFinished()
	}

	function handleDelete() {
		deleteCollection(collectionId)
			.then(() => onFinished())
	}

	return {
		collectionName: collection ? collection.name : null,
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}
}
