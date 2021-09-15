import {useStateRef, useValidatedState} from "../../../../../../components/utils/commonHooks";
import {CollectionTypeDTO, GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useCreateCollection} from "../../../../../hooks/core/collectionCreate";
import {useFindGroup} from "../../../../../hooks/store/collectionsState";

export function useDialogCollectionCreate(parentGroupId: number | null, onFinished: () => void) {

	const createCollection = useCreateCollection();
	const findGroup = useFindGroup();
	const parentGroup: GroupDTO | null = findGroup(parentGroupId)

	const [
		getName,
		setName,
		isNameValid,
		triggerNameValidation
	] = useValidatedState("", true, validateName);

	const [
		type,
		setType,
		refType
	] = useStateRef<CollectionTypeDTO>("normal")

	const [
		query,
		setQuery,
		refQuery
	] = useStateRef("")

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

	function handleCancel() {
		onFinished()
	}

	function handleCreate() {
		if (triggerNameValidation()) {
			createCollection(getName(), refType.current, refQuery.current, parentGroupId)
				.then(() => onFinished())
		}
	}

	return {
		parentName: parentGroup ? parentGroup.name : null,
		setName: setName,
		isNameValid: isNameValid,
		getType: () => type,
		setType: setType,
		getQuery: () => refQuery.current,
		setQuery: setQuery,
		handleCancel: handleCancel,
		handleCreate: handleCreate
	}

}
