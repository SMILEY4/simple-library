import {useDeleteItems} from "../../../hooks/core/itemsDelete";

export function useDialogItemsDelete(itemIds: number[], activeCollectionId: number, onFinished: (deleted: boolean) => void) {

	const deleteItems = useDeleteItems();

	function handleCancel() {
		onFinished(false)
	}

	function handleDelete() {
		deleteItems(itemIds);
		onFinished(true);
	}

	return {
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}
}
