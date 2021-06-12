import React, {useState} from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Label} from "../../../../components/base/label/Label";
import {useGroups} from "../../../hooks/groupHooks";
import {CheckBox} from "../../../../components/buttons/checkbox/CheckBox";
import {useCollections} from "../../../hooks/collectionHooks";
import {Group} from "../../../../../common/commonModels";

interface DialogDeleteGroupProps {
	groupId: number,
	onClose: () => void,
}

export function DialogDeleteGroup(props: React.PropsWithChildren<DialogDeleteGroupProps>): React.ReactElement {

	const {
		findGroup,
		deleteGroup
	} = useGroups();

	const {
		activeCollectionId,
		findCollection
	} = useCollections()

	const [keepContent, setKeepContent] = useState(false)

	const group: Group | null = findGroup(props.groupId);

	return group && (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Delete Group"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleDelete}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label>
						Are you sure sure you want to delete the group <b>{group.name}</b>?
					</Label>
					<CheckBox selected={keepContent} onToggle={setKeepContent}>Keep content of group</CheckBox>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleDelete} variant="error">Delete</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleDelete() {
		deleteGroup(props.groupId, keepContent)
			.then(() => props.onClose())
			.then(() => {
				if (!keepContent && !findCollection(activeCollectionId)) {

				}
			})
	}

}
