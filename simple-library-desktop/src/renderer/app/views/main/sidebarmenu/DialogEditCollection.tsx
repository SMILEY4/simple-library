import React from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../Application";
import {Slot} from "../../../../components/base/slot/Slot";
import {VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Label} from "../../../../components/base/label/Label";
import {TextField} from "../../../../components/input/textfield/TextField";
import {useActiveCollection, useCollections, useCollectionsStateless} from "../../../hooks/base/collectionHooks";
import {Collection, CollectionType} from "../../../../../common/commonModels";
import {Spacer} from "../../../../components/base/spacer/Spacer";
import {TextArea} from "../../../../components/input/textarea/TextArea";
import {useGroups} from "../../../hooks/base/groupHooks";
import {useItems, useItemSelection} from "../../../hooks/base/itemHooks";
import {useStateRef, useValidatedState} from "../../../../components/utils/commonHooks";

interface DialogEditCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogEditCollection(props: React.PropsWithChildren<DialogEditCollectionProps>): React.ReactElement {

	const {
		findCollection,
	} = useCollections()

	const {
		activeCollectionId,
		openCollection
	} = useActiveCollection()

	const {
		editCollection
	} = useCollectionsStateless()

	const {
		loadGroups
	} = useGroups()

	const {
		loadItems
	} = useItems();

	const {
		clearSelection
	} = useItemSelection()

	const collection: Collection = findCollection(props.collectionId);

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation,
		refName,
		refNameValid
	] = useValidatedState(collection.name, true, validateName)

	const [
		query,
		setQuery,
		refQuery
	] = useStateRef(collection.smartQuery)

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Edit Collection"}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleEdit}
			withOverlay
			closable
			closeOnClickOutside
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">

					<VBox alignMain="center" alignCross="stretch" spacing="0-25">
						<Label type="caption" variant="secondary">Collection Name:</Label>
						<TextField
							autofocus
							placeholder={"Collection Name"}
							value={name}
							onAccept={setName}
							error={!nameValid}
							onChange={(value: string) => !nameValid && setName(value)}
						/>
					</VBox>

					{collection.type === CollectionType.SMART && (
						<>
							<Spacer size="0-5" dir="horizontal" line/>
							<VBox alignMain="center" alignCross="stretch" spacing="0-25">
								<Label
									type="caption"
									variant="secondary"
									disabled={collection.type !== CollectionType.SMART}
								>
									Smart-Collection Query:
								</Label>
								<TextArea
									value={query}
									cols={30}
									rows={4}
									placeholder={"Empty to select all"}
									disabled={collection.type !== CollectionType.SMART}
									resize="none"
									onAccept={setQuery}
								/>
							</VBox>
						</>
					)}

				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!nameValid} onAction={handleEdit}>Save</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleEdit() {
		triggerNameValidation();
		if (refNameValid.current) {
			editCollection(props.collectionId, refName.current, collection.type === CollectionType.SMART ? refQuery.current : null)
				.then(() => loadGroups())
				.then(() => {
					if (activeCollectionId === props.collectionId) {
						clearSelection();
						loadItems(props.collectionId);
					}
				})
				.then(() => props.onClose())
		}
	}

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

}
