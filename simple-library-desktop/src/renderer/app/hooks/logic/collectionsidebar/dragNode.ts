import React from "react";
import {DragAndDropCollections, DragAndDropGroups} from "../../../common/dragAndDrop";
import {useCollectionSidebarUtils} from "./collectionSidebarUtils";

export function useDragNode() {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	function dragGroup(groupId: number, event: React.DragEvent): void {
		DragAndDropGroups.setDragData(event.dataTransfer, groupId);
	}

	function dragCollection(collectionId: number, event: React.DragEvent) {
		DragAndDropCollections.setDragData(event.dataTransfer, collectionId);
	}

	return (nodeId: string, event: React.DragEvent) => {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP:
				return dragGroup(getNodeObjectId(nodeId), event)
			case NODE_TYPE_COLLECTION:
				return dragCollection(getNodeObjectId(nodeId), event)
		}
	}
}
