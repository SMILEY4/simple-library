import React from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {PanelListAppearance} from "./PanelListAppearance";

interface AppearanceSettingsProps {
	listAppearanceEntries: AttributeMetaDTO[],
	onAddListAppearanceEntry: (e: AttributeMetaDTO) => void,
	onDeleteListAppearanceEntry: (e: AttributeMetaDTO) => void,
	onMoveListAppearanceEntryUp: (e: AttributeMetaDTO) => void,
	onMoveListAppearanceEntryDown: (e: AttributeMetaDTO) => void
}

export function AppearanceSettings(props: React.PropsWithChildren<AppearanceSettingsProps>): React.ReactElement {

	return (
		<VBox spacing="1" alignMain="start" alignCross="start" padding="1-5">

			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<Label bold>List Appearance</Label>
				<PanelListAppearance
					entries={props.listAppearanceEntries}
					onAddEntry={props.onAddListAppearanceEntry}
					onDeleteEntry={props.onDeleteListAppearanceEntry}
					onMoveEntryUp={props.onMoveListAppearanceEntryUp}
					onMoveEntryDown={props.onMoveListAppearanceEntryDown}
				/>
			</VBox>

		</VBox>
	);

}
