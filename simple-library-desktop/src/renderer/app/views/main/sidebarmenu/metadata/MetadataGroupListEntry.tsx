import {AttributeDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import React from "react";
import {Accordion} from "../../../../../components/misc/accordion/Accordion";
import {VBox} from "../../../../../components/layout/box/Box";
import {MetadataListEntry} from "./MetadataListEntry";

interface MetadataGroupListEntryProps {
	searchFilter: string,
	title: string,
	entries: ([string, AttributeDTO])[];
	onUpdateValue: (entry: AttributeDTO, prev: AttributeValueDTO, next: AttributeValueDTO) => void,
	onContextMenu: (attributeId: number, attributeName: string, event: React.MouseEvent) => void,
}


export function MetadataGroupListEntry(props: React.PropsWithChildren<MetadataGroupListEntryProps>): React.ReactElement {

	const doSearch: boolean = !!props.searchFilter && props.searchFilter.trim().length > 0;

	const displayEntries = props.entries
		.filter(entry => !entry[1].key.name.startsWith("ExifTool."))
		.filter(entry => !doSearch || entry[1].key.name.toLowerCase().includes(props.searchFilter.trim()));

	if (displayEntries.length === 0) {
		return null;
	} else {
		return (
			<Accordion title={props.title}
					   label={doSearch ? displayEntries.length + "/" + props.entries.length : "" + props.entries.length}>
				<VBox spacing="0-5" padding="0-5" alignCross="stretch">
					{
						displayEntries
							.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()))
							.map((entry: [string, AttributeDTO]) => {
								return <MetadataListEntry
									key={entry[1].attId}
									entry={entry[1]}
									shortName={entry[0]}
									onUpdateValue={(prev, next) => props.onUpdateValue(entry[1], prev, next)}
									onContextMenu={props.onContextMenu}
								/>;
							})
					}
				</VBox>
			</Accordion>
		);
	}

}

