import React from "react";
import {Dialog} from "../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../Application";
import {Slot} from "../../../../components/base/slot/Slot";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {TextField} from "../../../../components/input/textfield/TextField";
import {useCollections, useCollectionsStateless} from "../../../hooks/base/collectionHooks";
import {CollectionType, Group} from "../../../../../common/commonModels";
import {Spacer} from "../../../../components/base/spacer/Spacer";
import {TextArea} from "../../../../components/input/textarea/TextArea";
import {ChoiceBox, ChoiceBoxItem} from "../../../../components/buttons/choicebox/ChoiceBox";
import {ElementLabel} from "../../../../components/misc/elementlabel/ElementLabel";
import {useStateRef, useValidatedStateOLD} from "../../../../components/utils/commonHooks";

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
	} = useCollections();

	const {
		createCollection
	} = useCollectionsStateless()

	const parentGroup: Group | null = findGroup(props.parentGroupId)

	const [
		name,
		setName,
		nameValid,
		triggerNameValidation,
		refName,
		refNameValid
	] = useValidatedStateOLD("", true, validateName)

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

					<ElementLabel text="Collection Name:">
						<TextField
							autofocus
							placeholder={"Collection Name"}
							value={name}
							onAccept={setName}
							error={!nameValid}
							onChange={(value: string) => !nameValid && setName(value)}
						/>
					</ElementLabel>

					<Spacer size="0-5" dir="horizontal" line/>

					<HBox alignMain="start">
						<ChoiceBox
							items={CB_ITEMS_TYPE}
							selectedItemId={type}
							onAction={setType}
						/>
					</HBox>
					<ElementLabel text="Smart-Collection Query:">
						<TextArea
							value={query}
							cols={30}
							rows={4}
							placeholder={"Empty to select all"}
							disabled={type !== CollectionType.SMART}
							resize="none"
							onAccept={setQuery}
						/>
					</ElementLabel>

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
