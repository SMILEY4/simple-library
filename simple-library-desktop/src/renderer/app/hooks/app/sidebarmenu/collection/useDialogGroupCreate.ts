import {useDialogController} from "../../miscApplicationHooks";
import {useState} from "react";
import {useCollections, useCollectionsState} from "../../../base/collectionHooks";
import {useValidatedState} from "../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../common/events/dtoModels";

export function useDialogGroupCreateController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

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


export function useDialogGroupCreate(parentGroupId: number | null, onFinished: (created: boolean) => void) {

	const {
		createGroup
	} = useCollections();

	const {
		findGroup,
	} = useCollectionsState();

	const [
		getName,
		setName,
		isNameValid,
		triggerNameValidation
	] = useValidatedState("", true, validateName)

	const parentGroup: GroupDTO | null = findGroup(parentGroupId)

	function validateName(newName: string): boolean {
		return newName.trim().length > 0
	}

	function handleCancel() {
		onFinished(false)
	}

	function handleCreate() {
		if (triggerNameValidation()) {
			createGroup(parentGroupId, getName());
			onFinished(true)
		}
	}

	return {
		parentName: parentGroup ? parentGroup.name : null,
		setName: setName,
		isNameValid: isNameValid,
		handleCreate: handleCreate,
		handleCancel: handleCancel
	}

}
