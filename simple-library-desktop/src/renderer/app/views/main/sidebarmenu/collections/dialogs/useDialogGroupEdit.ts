import {useDialogController} from "../../../../../hooks/miscApplicationHooks";
import {useState} from "react";
import {useValidatedState} from "../../../../../../components/utils/commonHooks";
import {useEditGroup} from "../../../../../hooks/core/groupEdit";
import {useFindGroup} from "../../../../../hooks/store/collectionsState";

export function useDialogGroupEditController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

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


export function useDialogGroupEdit(groupId: number, onClose: () => void) {

	const editGroup = useEditGroup();
	const findGroup = useFindGroup()
	const prevName: string = findGroup(groupId).name;

	const [
		getName,
		setName,
		isNameValid,
		triggerNameValidation
	] = useValidatedState(prevName, true, validateName)

	function validateName(newName: string): boolean {
		return newName.trim().length > 0
	}

	function handleCancel() {
		onClose()
	}

	function handleEdit() {
		if (triggerNameValidation()) {
			if (getName() !== prevName) {
				editGroup(groupId, getName());
			}
			onClose();
		}
	}

	return {
		getName: getName,
		setName: setName,
		isNameValid: isNameValid,
		handleEdit: handleEdit,
		handleCancel: handleCancel
	}

}
