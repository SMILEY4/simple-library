import {useDialogController} from "../miscApplicationHooks";
import {useState} from "react";
import {useCollections} from "../../base/collectionHooks";
import {useItems} from "../../base/itemHooks";
import {useItemSelection} from "../../base/itemSelectionHooks";

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

	const {
		deleteItems,
		loadItems
	} = useItems()

	const {
		loadGroups
	} = useCollections()

	const {
		clearSelection
	} = useItemSelection();

	function handleCancel() {
		onFinished(false)
	}

	function handleDelete() {
		deleteItems(itemIds)
			.then(() => clearSelection())
			.then(() => loadItems(activeCollectionId))
			.then(() => loadGroups())
			.then(() => onFinished(true))
	}

	return {
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}

}
