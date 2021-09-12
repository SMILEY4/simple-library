import {useDialogController} from "../../../../../hooks/app/miscApplicationHooks";
import {useState} from "react";
import {useCollectionsState} from "../../../../../hooks/base/collectionHooks";
import {useValidatedState} from "../../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useCreateGroup} from "../../../../../hooks/logic/core/createGroup";

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


export function useDialogGroupCreate(parentGroupId: number | null, onFinished: () => void) {

	const createGroup = useCreateGroup();
	const {findGroup} = useCollectionsState();

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
		onFinished()
	}

	function handleCreate() {
		if (triggerNameValidation()) {
			createGroup(getName(), parentGroupId)
				.then(() => onFinished())
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
