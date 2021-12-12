import React from "react";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Button} from "../../../../../components/buttons/button/Button";
import {Card} from "../../../../../components/layout/card/Card";
import {SettingsDialogTab, useDialogSettings} from "./useDialogSettings";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import "./dialogSettings.css";
import {ApplicationSettings} from "./ApplicationSettings";
import {AttributeSettings} from "./AttributeSettings";
import {AppearanceSettings} from "./AppearanceSettings";

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
		setAppConfig,

		hiddenAttributes,
		hideAttribute,
		showAttribute,

		defaultAttributeValues,
		setDefaultAttributeValue,
		deleteDefaultAttributeValue,

		customAttributes,
		createCustomAttribute,
		deleteCustomAttribute,

		listAppearanceEntries,
		addListAppearanceEntry,
		deleteListAppearanceEntry,
		moveListAppearanceEntryUp,
		moveListAppearanceEntryDown
	} = useDialogSettings(props.onClose);

	return (
		<Card
			title={"Settings"}
			onClose={handleCancel}
			closable
			noBodyPadding
			fitHeight
			className="settings-card"
		>
			<Slot name={"body"}>
				<HBox className="settings-body">
					<VBox className="settings-nav" alignMain="start" alignCross="stretch">
						<div onClick={() => setCurrentTab(SettingsDialogTab.APP)}>Application</div>
						<div onClick={() => setCurrentTab(SettingsDialogTab.ATTRIBUTES)}>Metadata</div>
						<div onClick={() => setCurrentTab(SettingsDialogTab.APPEARANCE)}>Appearance</div>
					</VBox>
					<VBox className="settings-content" alignMain="start">
						{currentTab === SettingsDialogTab.APP && (
							<ApplicationSettings
								config={appConfig}
								onSetConfig={setAppConfig}
								openConfigFile={handleOpenConfigFile}
							/>
						)}
						{currentTab === SettingsDialogTab.ATTRIBUTES && (
							<AttributeSettings
								hiddenAttributes={hiddenAttributes}
								hideAttribute={hideAttribute}
								showAttribute={showAttribute}
								defaultAttributeValues={defaultAttributeValues}
								onSetDefaultAttributeValue={setDefaultAttributeValue}
								onDeleteDefaultAttributeValue={deleteDefaultAttributeValue}
								customAttributes={customAttributes}
								onCreateCustomAttribute={createCustomAttribute}
								onDeleteCustomAttribute={deleteCustomAttribute}
							/>
						)}
						{currentTab === SettingsDialogTab.APPEARANCE && (
							<AppearanceSettings
								listAppearanceEntries={listAppearanceEntries}
								onAddListAppearanceEntry={addListAppearanceEntry}
								onDeleteListAppearanceEntry={deleteListAppearanceEntry}
								onMoveListAppearanceEntryUp={moveListAppearanceEntryUp}
								onMoveListAppearanceEntryDown={moveListAppearanceEntryDown}
							/>
						)}
					</VBox>
				</HBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button variant="info" onAction={handleSave}>Accept</Button>
			</Slot>
		</Card>
	);

}
