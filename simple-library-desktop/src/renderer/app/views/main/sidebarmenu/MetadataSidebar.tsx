import React from "react";
import {SidebarTab} from "../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../components/base/icon/Icon";
import {useMetadataSidebar} from "../../../hooks/app/sidebarmenu/metadata/useMetadataSidebar";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {MetadataEntry} from "../../../../../common/commonModels";
import {Label} from "../../../../components/base/label/Label";
import {LabelBox} from "../../../../components/base/labelbox/LabelBox";


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

				{metadataEntries.map((entry: MetadataEntry) => <MetadataListEntry key={entry.key} entry={entry}/>)}

				{/*<Accordion title={"Composite"} label={"14"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"EXIF"} label={"62"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"File"} label={"12"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"ICC_Profile"} label={"26"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"IPTC"} label={"10"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"Photoshop"} label={"20"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"XMP"} label={"26"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

				{/*<Accordion title={"Miscellaneous"} label={"2"}>*/}
				{/*	Metadata here*/}
				{/*</Accordion>*/}

			</VBox>

		</>
	);


}


interface MetadataListEntryProps {
	entry: MetadataEntry
}


function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

	return (
		<HBox spacing="0-5" alignCross="center" alignMain="center" className={"metadata-list-entry"}>

			<HBox style={{flex: 1, maxWidth: "200px"}} alignMain="end" alignCross="center">
				<Label bold className={"metadata-list-entry-key"}>
					{props.entry.key}
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
