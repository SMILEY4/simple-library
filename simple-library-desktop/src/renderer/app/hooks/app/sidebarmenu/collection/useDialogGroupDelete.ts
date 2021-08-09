import {useDialogController} from "../../miscApplicationHooks";
import {useState} from "react";
import {useCollections, useCollectionsState} from "../../../base/collectionHooks";
import {useStateRef} from "../../../../../components/utils/commonHooks";
import {GroupDTO} from "../../../../../../common/messaging/dtoModels";

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


export function useDialogGroupDelete(groupId: number, onFinished: (deleted: boolean) => void) {

	const {
		deleteGroup,
		loadGroups
	} = useCollections()

	const {
		findGroup,
	} = useCollectionsState()

	const [keepContent, setKeepContent, refKeepContent] = useStateRef(false)

	const group: GroupDTO | null = findGroup(groupId);

	function handleCancel() {
		onFinished(false)
	}

	function handleDelete() {
		deleteGroup(groupId, keepContent)
			.then(() => loadGroups())
			.then(() => onFinished(true))
		// todo check for possible bug: "!keepContent and group contains activeCollection" => what happens ?
	}

	return {
		groupName: group ? group.name : null,
		isKeepContent: () => refKeepContent.current,
		setKeepContent: setKeepContent,
		handleCancel: handleCancel,
		handleDelete: handleDelete
	}

}
