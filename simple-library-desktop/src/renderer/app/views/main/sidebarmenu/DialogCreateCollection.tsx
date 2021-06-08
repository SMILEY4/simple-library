import React from "react";
import {Dialog} from "../../../../newcomponents/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../application";
import {Slot} from "../../../../newcomponents/base/slot/Slot";
import {HBox, VBox} from "../../../../newcomponents/layout/box/Box";
import {Button} from "../../../../newcomponents/buttons/button/Button";
import {Label} from "../../../../newcomponents/base/label/Label";
import {TextField} from "../../../../newcomponents/input/textfield/TextField";
import {useValidatedState} from "../../../hooks/miscHooks";
import {useCollections} from "../../../hooks/collectionHooks";
import {CollectionType, Group} from "../../../../../common/commonModels";
import {Spacer} from "../../../../newcomponents/base/spacer/Spacer";
import {TextArea} from "../../../../newcomponents/input/textarea/TextArea";
import {useStateRef} from "../../../hooks/old/miscAppHooks";
import {useGroups} from "../../../hooks/groupHooks";
import {ChoiceBox, ChoiceBoxItem} from "../../../../newcomponents/buttons/choicebox/ChoiceBox";

interface DialogCreateCollectionProps {
	parentGroupId: number | null,
	onClose: () => void,
}

export function DialogCreateCollection(props: React.PropsWithChildren<DialogCreateCollectionProps>): React.ReactElement {

	const CB_ITEMS_TYPE: ChoiceBoxItem[] = [
		{
			id: CollectionType.NORMAL,
			text: "Normal"
		},
		{
			id: CollectionType.SMART,
			text: "Smart"
		}
	]

	const {
		findGroup,
		loadGroups
	} = useGroups();

	const {
		createCollection
	} = useCollections()

	const parentGroup: Group | null = findGroup(props.parentGroupId)

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation,
		refName,
		refNameValid
	] = useValidatedState("", true, validateName)

	const [
		type,
		setType,
		refType
	] = useStateRef<string>(CollectionType.NORMAL)

	const [
		query,
		setQuery,
		refQuery
	] = useStateRef("")

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Create Collection"}
			subtitle={props.parentGroupId ? "Create in '" + parentGroup.name + "'" : undefined}
			onClose={handleCancel}
			onEscape={handleCancel}
			onEnter={handleCreate}
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

					<Spacer size="0-5" dir="horizontal" line/>


					<HBox alignMain="start">
						<ChoiceBox
							items={CB_ITEMS_TYPE}
							selectedItemId={type}
							onAction={setType}
						/>
					</HBox>

					<VBox alignMain="center" alignCross="stretch" spacing="0-25">

						<Label
							type="caption"
							variant="secondary"
							disabled={type !== CollectionType.SMART}
						>
							Smart-Collection Query:
						</Label>
						<TextArea
							value={query}
							cols={30}
							rows={4}
							placeholder={"Empty to select all"}
							disabled={type !== CollectionType.SMART}
							resize="none"
							onAccept={setQuery}
						/>
					</VBox>

				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!nameValid} onAction={handleCreate}>Create</Button>
			</Slot>
		</Dialog>
	);

	function handleCancel() {
		props.onClose()
	}

	function handleCreate() {
		triggerNameValidation();
		if (refNameValid.current) {
			createCollection(props.parentGroupId, refName.current, stringToCollectionType(refType.current), refQuery.current)
				.then(() => loadGroups())
				.then(() => props.onClose())
		}
	}

	function validateName(name: string): boolean {
		return name.trim().length > 0;
	}

	function stringToCollectionType(strType: string): CollectionType {
		switch (strType) {
			case "" + CollectionType.NORMAL: {
				return CollectionType.NORMAL
			}
			case "" + CollectionType.SMART: {
				return CollectionType.SMART
			}
		}
	}

}
