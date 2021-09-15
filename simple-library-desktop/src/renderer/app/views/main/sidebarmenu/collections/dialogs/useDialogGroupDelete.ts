import {useStateRef} from "../../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../../common/events/dtoModels";
import {useDeleteGroup} from "../../../../../hooks/core/groupDelete";
import {useFindGroup} from "../../../../../hooks/store/collectionsState";

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
