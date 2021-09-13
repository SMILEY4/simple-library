import {useDialogController} from "../../../../../hooks/base/miscApplicationHooks";
import {useState} from "react";
import {useCollectionsState} from "../../../../../hooks/base/collectionHooks";
import {useStateRef, useValidatedState} from "../../../../../../components/utils/commonHooks";
import {CollectionTypeDTO, GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useCreateCollection} from "../../../../../hooks/logic/core/collectionCreate";

export function useDialogCollectionCreateController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

	const [show, open, close] = useDialogController();
	const [id, setId] = useState<number | null>(null)

	function openDialog(id: number | null): void {
		setId(id)
		open()
	}

	function closeDialog(): void {
		close()
		setId(null)
	}

	return [show, openDialog, closeDialog, id]
}


export function useDialogCollectionCreate(parentGroupId: number | null, onFinished: () => void) {

	const createCollection = useCreateCollection();
	const {findGroup} = useCollectionsState();
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