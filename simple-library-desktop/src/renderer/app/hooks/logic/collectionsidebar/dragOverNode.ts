import React from "react";
import {DragAndDropCollections, DragAndDropGroups, DragAndDropItems, DragAndDropUtils} from "../../../common/dragAndDrop";
import {GroupDTO} from "../../../../../common/events/dtoModels";
import {useCollectionsState} from "../../base/collectionHooks";
import {useCollectionSidebarUtils} from "./collectionSidebarUtils";

export function useDragOverNode() {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const {
		rootGroup,
		findCollection
	} = useCollectionsState();

	function dragOverGroup(groupId: number, event: React.DragEvent, rootGroup: GroupDTO): void {
		const metaMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);
		switch (metaMimeType) {
			case DragAndDropGroups.META_MIME_TYPE: {
				// drag a 'group' over a 'group'
				DragAndDropGroups.setDropEffect(event.dataTransfer, groupId, rootGroup);
				break;
			}
			case DragAndDropCollections.META_MIME_TYPE: {
				// drag a 'collection' over a 'group'
				DragAndDropCollections.setDropEffect(event.dataTransfer);
				break;
			}
			default: {
				// drag a 'something' over a 'group'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
				break;
			}
		}
	}

	function dragOverCollection(collectionId: number, event: React.DragEvent) {
		const metaMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);
		switch (metaMimeType) {
			case DragAndDropItems.META_MIME_TYPE: {
				// drag 'items' over a 'collection'
				DragAndDropItems.setDropEffect(event.dataTransfer, findCollection(collectionId));
				break;
			}
			default: {
				// drag a 'something' over a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
				break;
			}
		}
	}

	return (nodeId: string, event: React.DragEvent) => {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP: {
				dragOverGroup(getNodeObjectId(nodeId), event, rootGroup);
				break;
			}
			case NODE_TYPE_COLLECTION: {
				dragOverCollection(getNodeObjectId(nodeId), event);
				break;
			}
		}
	}
}
