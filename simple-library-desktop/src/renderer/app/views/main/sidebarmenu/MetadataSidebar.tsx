import React from "react";
import {SidebarTab} from "../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../components/base/icon/Icon";
import {useCollectionSidebar} from "../../../hooks/app/sidebarmenu/metadata/useMetadataSidebar";


export const TAB_DATA_METADATA: SidebarTab = {
	id: "tab-metadata",
	title: "Metadata",
	icon: IconType.TAGS
}

interface MetadataSidebarProps {
}

export function MetadataSidebar(props: React.PropsWithChildren<MetadataSidebarProps>): React.ReactElement {

	const {} = useCollectionSidebar();

	return (
		<>

		</>
	);

}
