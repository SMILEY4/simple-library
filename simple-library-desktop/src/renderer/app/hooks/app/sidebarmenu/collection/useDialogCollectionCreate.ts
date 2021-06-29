import {useDialogController} from "../../miscApplicationHooks";
import {useState} from "react";
import {useCollections, useCollectionsState} from "../../../base/collectionHooks";
import {CollectionType, Group} from "../../../../../../common/commonModels";
import {useStateRef, useValidatedState} from "../../../../../components/utils/commonHooks";

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


export function useDialogCollectionCreate(parentGroupId: number | null, onFinished: (created: boolean) => void) {

	const {
		loadGroups,
		createCollection
	} = useCollections();

	const {
		findGroup,
	} = useCollectionsState();


	const parentGroup: Group | null = findGroup(parentGroupId)

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
	] = useStateRef<string>("" + CollectionType.NORMAL)

	const [
		query,
		setQuery,
		refQuery
	] = useStateRef("")

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

	function handleCancel() {
		onFinished(false)
	}

	function handleCreate() {
		if (triggerNameValidation()) {
			createCollection(parentGroupId, getName(), stringToCollectionType(refType.current), refQuery.current)
				.catch(() => onFinished(false))
				.then(() => loadGroups())
				.then(() => onFinished(true))
		}
	}

	function stringToCollectionType(strType: string): CollectionType {
		switch (strType) {
			case "" + CollectionType.NORMAL: {
				return CollectionType.NORMAL
			}
			case "" + CollectionType.SMART: {
				return CollectionType.SMART
			}
		}
	}

	return {
		parentName: parentGroup ? parentGroup.name : null,
		setName: setName,
		isNameValid: isNameValid,
		getType: () => stringToCollectionType(type),
		setType: setType,
		getQuery: () => refQuery.current,
		setQuery: setQuery,
		handleCancel: handleCancel,
		handleCreate: handleCreate
	}

}
