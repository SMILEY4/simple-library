import {useDialogController} from "../useDialogController";
import {useState} from "react";
import {useActiveCollection, useCollections, useCollectionsStateless} from "../../base/collectionHooks";
import {useItemSelection, useItemsStateless} from "../../base/itemHooks";
import {Collection, CollectionType} from "../../../../../common/commonModels";
import {useStateRef, useValidatedState} from "../../../../components/utils/commonHooks";

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
		findCollection,
		loadGroups
	} = useCollections()

	const {
		activeCollectionId,
	} = useActiveCollection()

	const {
		editCollection
	} = useCollectionsStateless()

	const {
		loadItems
	} = useItemsStateless();

	const {
		clearSelection
	} = useItemSelection()

	const collection: Collection = findCollection(collectionId);

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
			editCollection(collectionId, getName(), collection.type === CollectionType.SMART ? refQuery.current : null)
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
		isSmartCollection: collection.type === CollectionType.SMART,
		getName: getName,
		setName: setName,
		isNameValid: isNameValid,
		setQuery: setQuery,
		getQuery: () => refQuery.current,
		handleEdit: handleEdit,
		handleCancel: handleCancel
	}

}
