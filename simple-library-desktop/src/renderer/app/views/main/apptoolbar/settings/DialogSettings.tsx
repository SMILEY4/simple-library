import React from "react";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {Card} from "../../../../../components/layout/card/Card";
import {useDialogSettings} from "./useDialogSettings";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import "./dialogSettings.css";
import {Label} from "../../../../../components/base/label/Label";

interface DialogSettingsProps {
	onClose: () => void,
}

export function DialogSettings(props: React.PropsWithChildren<DialogSettingsProps>): React.ReactElement {

	const {
		handleCancel,
		handleSave,
		handleOpenConfigFile
	} = useDialogSettings(props.onClose);

	return (
		<Card
			title={"Settings"}
			onClose={handleCancel}
			closable
			noBodyPadding
			className="settings-card"
		>
			<Slot name={"body"}>
				<HBox className="settings-body">
					<VBox className="settings-nav">
						<div>Entry 1</div>
						<div>Entry 2</div>
						<div>Entry 3</div>
					</VBox>
					<VBox className="settings-content">
						Settings
					</VBox>
				</HBox>
			</Slot>
			<Slot name={"footer"}>
				<Label underline clickable onClick={handleOpenConfigFile}>Open Config File</Label>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" onAction={handleSave}>OK</Button>
			</Slot>
		</Card>
	);

}
