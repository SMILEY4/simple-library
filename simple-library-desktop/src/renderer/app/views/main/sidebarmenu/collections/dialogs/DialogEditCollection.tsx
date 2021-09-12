import React from "react";
import {Dialog} from "../../../../../../components/modals/dialog/Dialog";
import {APP_ROOT_ID} from "../../../../../Application";
import {Slot} from "../../../../../../components/base/slot/Slot";
import {VBox} from "../../../../../../components/layout/box/Box";
import {Button} from "../../../../../../components/buttons/button/Button";
import {Label} from "../../../../../../components/base/label/Label";
import {TextField} from "../../../../../../components/input/textfield/TextField";
import {Spacer} from "../../../../../../components/base/spacer/Spacer";
import {TextArea} from "../../../../../../components/input/textarea/TextArea";
import {useDialogCollectionEdit} from "./useDialogCollectionEdit";

interface DialogEditCollectionProps {
	collectionId: number,
	onClose: () => void,
}

export function DialogEditCollection(props: React.PropsWithChildren<DialogEditCollectionProps>): React.ReactElement {

	const {
		isSmartCollection,
		getName,
		setName,
		isNameValid,
		setQuery,
		getQuery,
		handleCancel,
		handleEdit
	} = useDialogCollectionEdit(props.collectionId, props.onClose);

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
							value={getName()}
							onAccept={setName}
							error={!isNameValid()}
							onChange={(value: string) => !isNameValid() && setName(value)}
						/>
					</VBox>

					{isSmartCollection && (
						<>
							<Spacer size="0-5" dir="horizontal" line/>
							<VBox alignMain="center" alignCross="stretch" spacing="0-25">
								<Label
									type="caption"
									variant="secondary"
								>
									Smart-Collection Query:
								</Label>
								<TextArea
									value={getQuery()}
									cols={30}
									rows={4}
									placeholder={"Empty to select all"}
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
				<Button variant="info" disabled={!isNameValid()} onAction={handleEdit}>Save</Button>
			</Slot>
		</Dialog>
	);

}
