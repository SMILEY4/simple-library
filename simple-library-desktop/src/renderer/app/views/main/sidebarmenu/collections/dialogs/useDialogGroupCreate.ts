import {useValidatedState} from "../../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useCreateGroup} from "../../../../../hooks/core/groupCreate";
import {useFindGroup} from "../../../../../hooks/store/collectionsState";

export function useDialogGroupCreate(parentGroupId: number | null, onFinished: () => void) {

	const createGroup = useCreateGroup();
	const findGroup = useFindGroup();

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
