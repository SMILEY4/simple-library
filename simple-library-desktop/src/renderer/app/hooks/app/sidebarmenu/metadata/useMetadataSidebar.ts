import {useItemSelectionState} from "../../../base/itemSelectionHooks";
import {useEffect, useState} from "react";
import {MetadataEntry} from "../../../../../../common/commonModels";
import {fetchItemMetadata} from "../../../../common/messagingInterface";

export function useMetadataSidebar() {

	const [metadata, setMetadata] = useState<MetadataEntry[]>([])

	const {
		selectedItemIds
	} = useItemSelectionState();

	useEffect(() => {
		if (selectedItemIds && selectedItemIds.length === 1) {
			fetchItemMetadata(selectedItemIds[0])
				.then((entries: MetadataEntry[]) => setMetadata(entries))
		} else {
			setMetadata([])
		}
	}, [selectedItemIds])

	return {
		metadataEntries: metadata
	}

}
