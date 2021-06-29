import React from "react";
import {Dialog} from "../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../Application";
import {Slot} from "../../../../../components/base/slot/Slot";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Button} from "../../../../../components/buttons/button/Button";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {CollectionType} from "../../../../../../common/commonModels";
import {Spacer} from "../../../../../components/base/spacer/Spacer";
import {TextArea} from "../../../../../components/input/textarea/TextArea";
import {ChoiceBox, ChoiceBoxItem} from "../../../../../components/buttons/choicebox/ChoiceBox";
import {ElementLabel} from "../../../../../components/misc/elementlabel/ElementLabel";
import {useDialogCollectionCreate} from "../../../../hooks/app/sidebarmenu/collection/useDialogCollectionCreate";

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
		parentName,
		setName,
		isNameValid,
		getType,
		setType,
		getQuery,
		setQuery,
		handleCreate,
		handleCancel
	} = useDialogCollectionCreate(props.parentGroupId, props.onClose);

	return (
		<Dialog
			show={true}
			modalRootId={APP_ROOT_ID}
			icon={undefined}
			title={"Create Collection"}
			subtitle={props.parentGroupId ? "Create in '" + parentName + "'" : undefined}
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
							error={!isNameValid()}
							onChange={(value: string) => !isNameValid() && setName(value)}
						/>
					</ElementLabel>

					<Spacer size="0-5" dir="horizontal" line/>

					<HBox alignMain="start">
						<ChoiceBox
							items={CB_ITEMS_TYPE}
							selectedItemId={getType()}
							onAction={setType}
						/>
					</HBox>
					<ElementLabel text="Smart-Collection Query:" disabled={getType() !== CollectionType.SMART}>
						<TextArea
							value={getQuery()}
							cols={30}
							rows={4}
							placeholder={"Empty to select all"}
							disabled={getType() !== CollectionType.SMART}
							resize="none"
							onAccept={setQuery}
						/>
					</ElementLabel>

				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" disabled={!isNameValid()} onAction={handleCreate}>Create</Button>
			</Slot>
		</Dialog>
	);

}
