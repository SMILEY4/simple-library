import {CollectionDTO} from "../../../../../../../common/events/dtoModels";
import {useDeleteCollection} from "../../../../../hooks/core/collectionDelete";
import {useFindCollection} from "../../../../../hooks/store/collectionsState";

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
