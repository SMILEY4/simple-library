import React from "react";
import {DragAndDropCollections, DragAndDropGroups, DragAndDropItems, DragAndDropUtils} from "../../common/dragAndDrop";
import {useCollections} from "../base/collectionHooks";
import {useItems} from "../base/itemHooks";
import {useActiveCollectionState} from "../base/activeCollectionHooks";
import {useCollectionSidebarUtils} from "./collectionSidebarUtils";
import {useMoveGroup} from "./core/moveGroup";
import {useMoveCollection} from "./core/moveCollection";
import {useMoveItems} from "./core/moveItems";

export function useDropOnNode() {

	const {
		activeCollectionId,
	} = useActiveCollectionState();

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const {
		loadGroups,
	} = useCollections();

	const {
		loadItems,
		moveOrCopyItems
	} = useItems();

	const moveGroup = useMoveGroup();
	const moveCollection = useMoveCollection();
	const moveItems = useMoveItems();

	function dropOnGroup(groupId: number, event: React.DragEvent): void {
		const metaMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);
		switch (metaMimeType) {
			case DragAndDropGroups.META_MIME_TYPE: {
				// drop a 'group' on a 'group'
				const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(event.dataTransfer);
				moveGroup(dropData.groupId, groupId);
				break;
			}
			case DragAndDropCollections.META_MIME_TYPE: {
				// drop a 'collection' on a 'group'
				const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(event.dataTransfer);
				moveCollection(dropData.collectionId, groupId);
				break;
			}
			default: {
				// drop a 'something' on a 'group'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
				break;
			}
		}
	}


	function dropOnCollection(collectionId: number, event: React.DragEvent) {
		const metaMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);
		switch (metaMimeType) {
			case DragAndDropItems.META_MIME_TYPE: {
				// drop 'items' on a 'collection'
				const dropData: DragAndDropItems.Data = DragAndDropItems.getDragData(event.dataTransfer);
				moveItems(dropData.itemIds, dropData.sourceCollectionId, collectionId, dropData.copy);
				break;
			}
			default: {
				// drop 'something' on a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
				break;
			}
		}
	}

	return (nodeId: string, event: React.DragEvent) => {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP: {
				dropOnGroup(getNodeObjectId(nodeId), event);
				break;
			}
			case NODE_TYPE_COLLECTION: {
				dropOnCollection(getNodeObjectId(nodeId), event);
				break;
			}
		}
	}
}
