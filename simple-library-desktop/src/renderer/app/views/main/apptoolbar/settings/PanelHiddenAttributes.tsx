import React from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../../components/base/icon/Icon";
import "./panelHiddenAttributes.css";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {AttributeMetaSelectionList} from "./AttributeMetaSelectionList";


interface PanelHiddenAttributes {
	hiddenAttributes: AttributeMetaDTO[],
	hideAttribute: (attribute: AttributeMetaDTO) => void,
	showAttribute: (attribute: AttributeMetaDTO) => void
}

export function PanelHiddenAttributes(props: React.PropsWithChildren<PanelHiddenAttributes>): React.ReactElement {

	return (
		<HBox spacing="0-5" alignMain="space-between" alignCross="start" className="hidden-attribs-base">
			<AttributeMetaSelectionList onSelect={hideField}/>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="hidden-attribs-selected">
				{props.hiddenAttributes.map(e => {
					return (
						<HBox spacing="0-25" padding="0-25" alignMain="space-between" alignCross="center" key={e.attId} className="attrib-entry">
							<VBox alignCross="start" alignMain="center">
								<Label overflow="cutoff">
									{e.key.name}
								</Label>
								<Label type="caption" variant="secondary" overflow="cutoff">
									{e.key.g0 + ", " + e.key.g1 + ", " + e.key.g2}
								</Label>
							</VBox>
							<IconButton ghost icon={IconType.CLOSE} onAction={() => showField(e)}/>
						</HBox>
					);
				})}
			</VBox>
		</HBox>
	);

	function hideField(attrib: AttributeMetaDTO) {
		props.hideAttribute(attrib);
	}

	function showField(attrib: AttributeMetaDTO) {
		props.showAttribute(attrib);
	}

}
