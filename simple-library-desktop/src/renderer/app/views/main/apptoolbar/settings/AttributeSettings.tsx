import React from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {PanelHiddenAttributes} from "./PanelHiddenAttributes";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeKeyDTO} from "../../../../../../common/events/dtoModels";

interface AttributeSettingsProps {
	hiddenAttributes: AttributeKeyDTO[],
	hideAttribute: (attribute: AttributeKeyDTO) => void,
	showAttribute: (attribute: AttributeKeyDTO) => void
}

export function AttributeSettings(props: React.PropsWithChildren<AttributeSettingsProps>): React.ReactElement {

	return (
		<VBox spacing="1" alignMain="start" alignCross="start" padding="1-5">
			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<Label bold>Hidden Fields</Label>
				<PanelHiddenAttributes
					hiddenAttributes={props.hiddenAttributes}
					hideAttribute={props.hideAttribute}
					showAttribute={props.showAttribute}
				/>
			</VBox>
		</VBox>
	);

}
