import {useDialogController} from "../../../../../hooks/base/miscApplicationHooks";
import {useState} from "react";
import {useStateRef} from "../../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useDeleteGroup} from "../../../../../hooks/logic/core/groupDelete";
import {useFindGroup} from "../../../../../store/collectionsState";

export function useDialogGroupDeleteController(): [boolean, (id: number | null) => void, () => void, (number | null)] {

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


export function useDialogGroupDelete(groupId: number, onFinished: () => void) {

	const deleteGroup = useDeleteGroup();
	const findGroup = useFindGroup()
	const group: GroupDTO | null = findGroup(groupId);

	const [
		keepContent,
		setKeepContent,
		refKeepContent
	] = useStateRef(false)


	function handleCancel() {
		onFinished()
	}

	function handleDelete() {
		deleteGroup(groupId, keepContent)
			.then(() => onFinished())
	}

	return {
		groupName: group ? group.name : null,
		isKeepContent: () => refKeepContent.current,
		setKeepContent: setKeepContent,
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}

}
