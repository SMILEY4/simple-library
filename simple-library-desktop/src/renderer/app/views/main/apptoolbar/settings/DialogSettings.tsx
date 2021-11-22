import React from "react";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {Card} from "../../../../../components/layout/card/Card";
import {SettingsDialogTab, useDialogSettings} from "./useDialogSettings";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import "./dialogSettings.css";
import {Label} from "../../../../../components/base/label/Label";
import {ApplicationSettings} from "./ApplicationSettings";

interface DialogSettingsProps {
	onClose: () => void,
}

export function DialogSettings(props: React.PropsWithChildren<DialogSettingsProps>): React.ReactElement {

	const {
		currentTab,
		setCurrentTab,
		handleCancel,
		handleSave,
		handleOpenConfigFile,
		appConfig,
		setAppConfig
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
					<VBox className="settings-nav" alignMain="start">
						<div onClick={() => setCurrentTab(SettingsDialogTab.APP)}>Application</div>
						<div onClick={() => setCurrentTab(SettingsDialogTab.PLACEHOLDER)}>Placeholder</div>
					</VBox>
					<VBox className="settings-content">
						{currentTab === SettingsDialogTab.APP && (
							<ApplicationSettings
								config={appConfig}
								onSetConfig={setAppConfig}
								openConfigFile={handleOpenConfigFile}
							/>
						)}
						{currentTab === SettingsDialogTab.PLACEHOLDER && (
							<Label>Placeholder</Label>
						)}
					</VBox>
				</HBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" onAction={handleSave}>OK</Button>
			</Slot>
		</Card>
	);

}
