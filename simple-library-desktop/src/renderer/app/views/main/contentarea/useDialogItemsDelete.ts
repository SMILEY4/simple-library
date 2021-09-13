import {useDialogController} from "../../../hooks/base/miscApplicationHooks";
import {useState} from "react";
import {useDeleteItems} from "../../../hooks/logic/core/itemsDelete";

export function useDialogItemsDeleteController(): [boolean, (id: number[] | null) => void, () => void, (number[] | null)] {

	const [show, open, close] = useDialogController();
	const [ids, setIds] = useState<number[] | null>(null)

	function openDialog(ids: number[] | null): void {
		if (ids) {
			setIds(ids)
			open()
		}
	}

	function closeDialog(): void {
		close()
		setIds(null)
	}

	return [show, openDialog, closeDialog, ids]
}


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
