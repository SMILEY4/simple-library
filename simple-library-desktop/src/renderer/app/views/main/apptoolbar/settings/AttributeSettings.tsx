import React from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {PanelHiddenAttributes} from "./PanelHiddenAttributes";
import {Label} from "../../../../../components/base/label/Label";
import {
	AttributeKeyDTO,
	AttributeMetaDTO,
	DefaultAttributeValueEntryDTO
} from "../../../../../../common/events/dtoModels";
import {PanelDefaultAttributeValues} from "./PanelDefaultAttributeValues";
import {PanelCustomAttributes} from "./PanelCustomAttributes";

interface AttributeSettingsProps {
	hiddenAttributes: AttributeMetaDTO[],
	hideAttribute: (attribute: AttributeMetaDTO) => void,
	showAttribute: (attribute: AttributeMetaDTO) => void,

	defaultAttributeValues: DefaultAttributeValueEntryDTO[];
	onSetDefaultAttributeValue: (entry: DefaultAttributeValueEntryDTO) => void;
	onDeleteDefaultAttributeValue: (attId: number) => void;

	customAttributes: AttributeMetaDTO[],
	onCreateCustomAttribute: (key: AttributeKeyDTO) => void
	onDeleteCustomAttribute: (attribute: AttributeMetaDTO) => void
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

			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<Label bold>Default Values</Label>
				<PanelDefaultAttributeValues
					defaultAttributeValues={props.defaultAttributeValues}
					onSetDefaultAttributeValue={props.onSetDefaultAttributeValue}
					onDeleteDefaultAttributeValue={props.onDeleteDefaultAttributeValue}
				/>
			</VBox>

			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<Label bold>Custom Fields</Label>
				<PanelCustomAttributes
					customAttributes={props.customAttributes}
					onCreateCustomAttribute={props.onCreateCustomAttribute}
					onDeleteCustomAttribute={props.onDeleteCustomAttribute}
				/>
			</VBox>

		</VBox>
	);

}
