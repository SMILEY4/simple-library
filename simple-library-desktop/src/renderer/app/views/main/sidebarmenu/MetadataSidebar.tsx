import React from "react";
import {SidebarTab} from "../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../components/base/icon/Icon";
import {useMetadataSidebar} from "../../../hooks/app/sidebarmenu/metadata/useMetadataSidebar";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {MetadataEntry} from "../../../../../common/commonModels";
import {Label} from "../../../../components/base/label/Label";
import {LabelBox} from "../../../../components/base/labelbox/LabelBox";
import {Accordion} from "../../../../components/misc/accordion/Accordion";


export const TAB_DATA_METADATA: SidebarTab = {
	id: "tab-metadata",
	title: "Metadata",
	icon: IconType.TAGS
}

interface MetadataSidebarProps {
}

export function MetadataSidebar(props: React.PropsWithChildren<MetadataSidebarProps>): React.ReactElement {

	const {
		metadataEntries
	} = useMetadataSidebar();

	return (
		<>

			<VBox spacing="0-5" padding="0-5" alignCross="stretch">
				{
					group(metadataEntries)
						.sort((a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
						.map(group => <MetadataGroupListEntry title={group.title} entries={group.entries}/>)
				}
			</VBox>

		</>
	);


	function group(entries: MetadataEntry[]): ({ title: string, entries: ([string, MetadataEntry])[] })[] {

		const groups: ({ title: string, entries: ([string, MetadataEntry])[] })[] = [];

		function insert(groupName: string, entryName: string, entry: MetadataEntry): void {
			let group = groups.find(g => g.title === groupName)
			if (!group) {
				groups.push({title: groupName, entries: [[entryName, entry]]})
			} else {
				group.entries.push([entryName, entry])
			}
		}

		entries.forEach((entry: MetadataEntry) => {
			const parts: string[] = entry.key.split(/\.(.+)/);
			if (parts.length >= 2) {
				insert(parts[0], parts[1], entry);
			} else {
				insert("Miscellaneous", entry.key, entry);
			}
		})

		return groups;
	}


}


interface MetadataGroupListEntryProps {
	title: string,
	entries: ([string, MetadataEntry])[];
}


function MetadataGroupListEntry(props: React.PropsWithChildren<MetadataGroupListEntryProps>): React.ReactElement {

	return (
		<Accordion title={props.title} label={"" + props.entries.length}>
			<VBox spacing="0-5" padding="0-5" alignCross="stretch">
				{
					props.entries
						.sort((a,b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()))
						.map((entry: [string,MetadataEntry]) => <MetadataListEntry key={entry[1].key} entry={entry[1]} shortName={entry[0]}/>)
				}
			</VBox>
		</Accordion>
	);
}


interface MetadataListEntryProps {
	entry: MetadataEntry,
	shortName: string
}


function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

	return (
		<HBox spacing="0-5" alignCross="center" alignMain="center" className={"metadata-list-entry"}>

			<HBox style={{flex: 1, maxWidth: "200px"}} alignMain="end" alignCross="center">
				<Label bold className={"metadata-list-entry-key"}>
					{props.shortName}
				</Label>
			</HBox>

			<HBox style={{flex: 1, maxWidth: "200px"}} alignMain="start" alignCross="center">
				<LabelBox className={"metadata-list-entry-value"} overflow="cutoff">
					{props.entry.value}
				</LabelBox>
			</HBox>

		</HBox>
	);
}