import {useStateRef, useValidatedState} from "../../../../../../components/utils/commonHooks";
import {CollectionDTO} from "../../../../../../../common/events/dtoModels";
import {useEditCollection} from "../../../../../hooks/core/collectionEdit";
import {useFindCollection} from "../../../../../hooks/store/collectionsState";

export function useDialogCollectionEdit(collectionId: number, onClose: () => void) {

	const editCollection = useEditCollection();
	const findCollection = useFindCollection();
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
