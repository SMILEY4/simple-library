import React, {ReactElement} from "react";
import {Slot} from "../../base/slot/Slot";
import {Button} from "../../buttons/button/Button";
import {Card} from "../../layout/card/Card";
import {Label} from "../../base/label/Label";

interface ConfirmationDialogProps {
	title: string,
	strContent?: string,
	elemContent?: ReactElement
	action: string,
	onResult?: (accept: boolean) => void,


}

export function ConfirmationDialog(props: React.PropsWithChildren<ConfirmationDialogProps>): React.ReactElement {

	return (
		<Card
			title={props.title}
			closable={true}
			onClose={onCancel}
		>
			<Slot name={"body"}>
				{
					props.elemContent
						? props.elemContent
						: <Label>{props.strContent}</Label>
				}
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={onCancel}>Cancel</Button>
				<Button onAction={onAccept} variant="info">{props.action}</Button>
			</Slot>
		</Card>
	);

	function onCancel() {
		props.onResult && props.onResult(false)
	}

	function onAccept() {
		props.onResult && props.onResult(true)
	}

}
