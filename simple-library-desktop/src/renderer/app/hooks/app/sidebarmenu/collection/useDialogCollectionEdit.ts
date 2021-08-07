import {useDialogController} from "../../miscApplicationHooks";
import {useState} from "react";
import { useCollections, useCollectionsState,} from "../../../base/collectionHooks";
import {useStateRef, useValidatedState} from "../../../../../components/utils/commonHooks";
import {useActiveCollectionState} from "../../../base/activeCollectionHooks";
import {useItems} from "../../../base/itemHooks";
import {useItemSelection} from "../../../base/itemSelectionHooks";
import {CollectionDTO} from "../../../../../../common/messaging/dtoModels";

export function useDialogCollectionEditController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

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


export function useDialogCollectionEdit(collectionId: number, onClose: () => void) {

	const {
		loadGroups,
		editCollection
	} = useCollections()

	const {
		findCollection,
	} = useCollectionsState()

	const {
		activeCollectionId,
	} = useActiveCollectionState()

	const {
		loadItems
	} = useItems();

	const {
		clearSelection
	} = useItemSelection()

	const collection: CollectionDTO = findCollection(collectionId);

	const [
		getName,
		setName,
		isNameValid,
		triggerNameValidation
	] = useValidatedState(collection.name, true, validateName);

	const [
		query,
		setQuery,
		refQuery
	] = useStateRef(collection.smartQuery)

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

	function handleCancel() {
		onClose()
	}

	function handleEdit() {
		if (triggerNameValidation()) {
			editCollection(collectionId, getName(), collection.type === "smart" ? refQuery.current : null)
				.then(() => loadGroups())
				.then(() => {
					if (activeCollectionId === collectionId) {
						clearSelection();
						loadItems(collectionId);
					}
				})
				.then(() => onClose())
		}
	}

	return {
		isSmartCollection: collection.type === "smart",
		getName: getName,
		setName: setName,
		isNameValid: isNameValid,
		setQuery: setQuery,
		getQuery: () => refQuery.current,
		handleEdit: handleEdit,
		handleCancel: handleCancel
	}

}
