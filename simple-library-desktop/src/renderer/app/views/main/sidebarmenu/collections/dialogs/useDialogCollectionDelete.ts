import {useDialogController} from "../../../../../hooks/miscApplicationHooks";
import {useState} from "react";
import {CollectionDTO} from "../../../../../../../common/events/dtoModels";
import {useDeleteCollection} from "../../../../../hooks/core/collectionDelete";
import {useFindCollection} from "../../../../../hooks/store/collectionsState";

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
	const findCollection = useFindCollection();
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
