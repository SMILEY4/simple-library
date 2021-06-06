import React, {useState} from "react";
import {Dialog} from "../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {Button} from "../../../../newcomponents/buttons/button/Button";
import {Label} from "../../../../newcomponents/base/label/Label";
import {TextField} from "../../../../newcomponents/input/textfield/TextField";
import {useValidatedState} from "../../../hooks/miscHooks";
import {useCollections} from "../../../hooks/collectionHooks";
import {ChoiceBoxItem} from "../../../../newcomponents/buttons/choicebox/ChoiceBox";
import {Collection, CollectionType} from "../../../../../common/commonModels";
import {Spacer} from "../../../../newcomponents/base/spacer/Spacer";
import {TextArea} from "../../../../newcomponents/input/textarea/TextArea";
import {useStateRef} from "../../../hooks/old/miscAppHooks";

interface DialogEditCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogEditCollection(props: React.PropsWithChildren<DialogEditCollectionProps>): React.ReactElement {

	const {
		findCollection,
		editCollection
	} = useCollections()

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
							<VBox alignMain="center" alignCross="stretch" spacing="0-25" style={{cursor: ""}}>
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
			editCollection(
				props.collectionId,
				refName.current,
				collection.type === CollectionType.SMART ? refQuery.current : null
			);
			props.onClose();
		}
	}

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

}
