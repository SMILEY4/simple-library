import React from "react";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {VBox} from "../../../../../components/layout/box/Box";
import {Card} from "../../../../../components/layout/card/Card";
import {
	EmbedDialogAttributeSelection,
	EmbedDialogItemSelection,
	useDialogEmbedAttributes
} from "./useDialogEmbedAttributes";
import {Label} from "../../../../../components/base/label/Label";
import {CheckBox} from "../../../../../components/buttons/checkbox/CheckBox";

interface DialogEmbedAttributesProps {
	onClose: () => void,
}

export function DialogEmbedAttributes(props: React.PropsWithChildren<DialogEmbedAttributesProps>): React.ReactElement {

	const {
		handleCancel,
		handleEmbed,
		itemSelection,
		attributeSelection,
		setItemSelection,
		setAttributeSelection
	} = useDialogEmbedAttributes(props.onClose)

	return (
		<Card
			title={"Embed Attributes"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="1" style={{
					paddingTop: "var(--s-0-5)",
					paddingBottom: "var(--s-0-5)"
				}}>

					<VBox alignCross="start" spacing="0-25">
						<Label bold>Which Files?</Label>
						<CheckBox
							selected={itemSelection === EmbedDialogItemSelection.ALL}
							onToggle={(selected) => setItemSelection(selected)}
							forceState
							style={{marginLeft: "var(--s-0-5)"}}
						>
							All
						</CheckBox>
						<CheckBox
							selected={itemSelection === EmbedDialogItemSelection.SELECTION}
							onToggle={(selected) => setItemSelection(!selected)}
							forceState
							style={{marginLeft: "var(--s-0-5)"}}
						>
							Selected
						</CheckBox>
					</VBox>

					<VBox alignCross="start" spacing="0-25">
						<Label bold>Which Attributes?</Label>
						<CheckBox
							selected={attributeSelection === EmbedDialogAttributeSelection.ALL}
							onToggle={(selected) => setAttributeSelection(selected)}
							forceState
							style={{marginLeft: "var(--s-0-5)"}}
						>
							All
						</CheckBox>
						<CheckBox
							selected={attributeSelection === EmbedDialogAttributeSelection.MODIFIED}
							onToggle={(selected) => setAttributeSelection(!selected)}
							forceState
							style={{marginLeft: "var(--s-0-5)"}}
						>
							Modified
						</CheckBox>
					</VBox>

				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" onAction={handleEmbed}>Embed</Button>
			</Slot>
		</Card>
	);

}
