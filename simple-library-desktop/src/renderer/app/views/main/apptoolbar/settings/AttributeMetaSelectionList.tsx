import React, {useEffect, useState} from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../../components/base/icon/Icon";
import {fetchAllAttributeMetaFilterName} from "../../../../common/eventInterface";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {TextField} from "../../../../../components/input/textfield/TextField";
import "./attributeMetaSelectionList.css"

interface AttributeMetaSelectionListProps {
	onSelect: (entry: AttributeMetaDTO) => void;
}

export function AttributeMetaSelectionList(props: React.PropsWithChildren<AttributeMetaSelectionListProps>): React.ReactElement {

	const [search, setSearch] = useState("");
	const [attributeMeta, setAttributeMeta] = useState<AttributeMetaDTO[]>([]);

	useEffect(() => {
		if (search && search.trim().length >= 3) {
			fetchAllAttributeMetaFilterName(search).then(setAttributeMeta);
		} else {
			setAttributeMeta([]);
		}
	}, [search]);

	return (
		<VBox spacing="0-25" alignMain="start" alignCross="stretch" className="attrib-meta-selection-list">
			<TextField
				placeholder={"Search"}
				value={search}
				onAccept={value => setSearch(value.toLowerCase())}
			/>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="attrib-meta-selection-list-content">
				{attributeMeta.filter(e => e.key.name.toLowerCase().includes(search)).map(e => {
					return (
						<HBox spacing="0-25" padding="0-25" alignMain="space-between" alignCross="center" key={e.attId} className="attrib-meta-selection-list-entry">
							<VBox alignCross="start" alignMain="center">
								<Label overflow="cutoff">
									{e.key.name}
								</Label>
								<Label type="caption" variant="secondary" overflow="cutoff">
									{e.key.g0 + ", " + e.key.g1 + ", " + e.key.g2}
								</Label>
							</VBox>
							<IconButton ghost icon={IconType.CARET_RIGHT} onAction={() => props.onSelect && props.onSelect(e)}/>
						</HBox>

					);
				})}
				{attributeMeta.length === 0 && (
					<Label variant="secondary">Search Something</Label>
				)}
			</VBox>
		</VBox>
	);

}
