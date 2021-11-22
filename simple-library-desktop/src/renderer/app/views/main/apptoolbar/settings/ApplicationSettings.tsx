import React from "react";
import "./dialogSettings.css";
import {ApplicationConfigDTO} from "../../../../../../common/events/dtoModels";
import {VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {ChoiceBox} from "../../../../../components/buttons/choicebox/ChoiceBox";

interface ApplicationSettingsProps {
	config: ApplicationConfigDTO | null;
	onSetConfig: (config: ApplicationConfigDTO) => void;
	openConfigFile: () => void
}

export function ApplicationSettings(props: React.PropsWithChildren<ApplicationSettingsProps>): React.ReactElement {

	if(props.config === null) {
		return null;
	} else {
		return (
			<VBox spacing="1" alignMain="start" alignCross="start" padding="1-5">

				<VBox spacing="0-25" alignMain="start" alignCross="start">
					<Label bold>Application Theme</Label>
					<ChoiceBox
						items={[
							{id: "light", text: "Light"},
							{id: "dark", text: "Dark"}
						]}
						selectedItemId={props.config.theme}
						onAction={onUpdateTheme}
					/>
				</VBox>


				<VBox spacing="0-25" alignMain="start" alignCross="start">
					<Label bold>Exiftool</Label>
					<TextField
						placeholder={"Path to Exiftool-executable"}
						value={props.config.exiftoolPath ? props.config.exiftoolPath : ""}
						onAccept={onUpdateExiftoolPath}
						onChange={onUpdateExiftoolPath}
					/>
					<Label type="caption">May require restarting the application to take effect!</Label>
				</VBox>

				<Label underline clickable onClick={props.openConfigFile}>Open Config File</Label>

			</VBox>
		);
	}

	function onUpdateTheme(theme: string) {
		props.onSetConfig({
			...props.config,
			theme: (theme === "dark") ? "dark" : "light"
		});
	}

	function onUpdateExiftoolPath(path: string) {
		props.onSetConfig({
			...props.config,
			exiftoolPath: (path && path.trim().length > 0) ? path.trim() : null
		});
	}

}
