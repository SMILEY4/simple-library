import {useActiveCollectionState} from "../base/activeCollectionHooks";
import {useCollectionSidebarUtils} from "./collectionSidebarUtils";
import {useOpenCollection} from "./core/openCollection";

export function useActivateNode(): [string | undefined, (nodeId: string) => void] {

	const {
		activeCollectionId,
	} = useActiveCollectionState();

	const {
		NODE_TYPE_COLLECTION,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const openCollection = useOpenCollection();

	function activateNode(nodeId: string) {
		if (getNodeType(nodeId) === NODE_TYPE_COLLECTION) {
			openCollection(getNodeObjectId(nodeId));
		} else {
			console.error("Double-Click on unexpected element:", nodeId);
		}
	}

	return [
		activeCollectionId ? getNodeId(NODE_TYPE_COLLECTION, activeCollectionId) : undefined,
		activateNode
	];
}
