import React, {useState} from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {PanelHiddenAttributes} from "./PanelHiddenAttributes";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";

interface AttributeSettingsProps {
}

export function AttributeSettings(props: React.PropsWithChildren<AttributeSettingsProps>): React.ReactElement {

	const [hiddenFields, setHiddenFields] = useState<AttributeMetaDTO[]>([]);

	return (
		<VBox spacing="1" alignMain="start" alignCross="start" padding="1-5">
			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<Label bold>Hidden Fields</Label>
				<PanelHiddenAttributes hiddenAttributes={hiddenFields} onSetHiddenAttributes={setHiddenFields}/>
			</VBox>
		</VBox>
	);

}
