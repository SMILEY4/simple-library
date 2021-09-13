import React from "react";
import {
	DragAndDropCollections,
	DragAndDropGroups,
	DragAndDropItems,
	DragAndDropUtils
} from "../../../../common/dragAndDrop";
import {GroupDTO} from "../../../../../../common/events/dtoModels";
import {useDispatchSetRootGroup, useFindCollection, useRootGroup} from "../../../../hooks/store/collectionsState";
import {useMount} from "../../../../../components/utils/commonHooks";
import {fetchRootGroup} from "../../../../common/eventInterface";
import {genNotificationId} from "../../../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../../../../hooks/store/notificationState";
import {
	useCollectionSidebarState,
	useDispatchCollapseNode,
	useDispatchExpandNode
} from "../../../../hooks/store/collectionSidebarState";
import {useMoveGroup} from "../../../../hooks/core/groupMove";
import {useMoveCollection} from "../../../../hooks/core/collectionMove";
import {useMoveItems} from "../../../../hooks/core/itemsMove";
import {useOpenCollection} from "../../../../hooks/core/collectionOpen";
import {useActiveCollection} from "../../../../hooks/store/collectionActiveState";

export function useCollectionSidebar() {

	const rootGroup = useRootGroup();
	const [expandedNodes, expandCollapseNode] = useExpandCollapseSidebarNode();
	const [activeNode, activateNode] = useOpenNode();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification()

	useMount(() => {
			fetchRootGroup()
				.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
				.then((group: GroupDTO) => dispatchSetRootGroup(group))
		}
	);

	return {
		activeNode: activeNode,
		expandedNodes: expandedNodes,
		toggleExpandNode: expandCollapseNode,
		rootGroup: rootGroup,
		dragStart: useDragNode(),
		dragOver: useDragOverNode(),
		drop: useDropOnNode(),
		handleDoubleClick: activateNode
	};

}


export function useCollectionSidebarUtils() {

	const NODE_TYPE_COLLECTION = "collection";
	const NODE_TYPE_GROUP = "group";

	function getNodeId(type: string, id: number): string {
		return type + "." + id;
	}

	function getNodeType(nodeId: string): string {
		return nodeId.substring(0, nodeId.indexOf("."));
	}

	function getNodeObjectId(nodeId: string): number | null {
		const id = Number.parseInt(nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length));
		return Number.isNaN(id) ? null : id;
	}

	return {
		NODE_TYPE_COLLECTION: NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP: NODE_TYPE_GROUP,
		getNodeId: getNodeId,
		getNodeType: getNodeType,
		getNodeObjectId: getNodeObjectId
	};

}


function useDragNode() {

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


function useDragOverNode() {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();
	const rootGroup = useRootGroup();
	const findCollection = useFindCollection();

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


function useDropOnNode() {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

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


function useOpenNode(): [string | undefined, (nodeId: string) => void] {

	const activeCollectionId = useActiveCollection();

	const {
		NODE_TYPE_COLLECTION,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const openCollection = useOpenCollection();

	function openNode(nodeId: string) {
		if (getNodeType(nodeId) === NODE_TYPE_COLLECTION) {
			openCollection(getNodeObjectId(nodeId));
		} else {
			console.error("Double-Click on unexpected element:", nodeId);
		}
	}

	return [
		activeCollectionId ? getNodeId(NODE_TYPE_COLLECTION, activeCollectionId) : undefined,
		openNode
	];
}


function useExpandCollapseSidebarNode(): [string[], (nodeId: string, expand: boolean) => void] {

	const [sidebarState] = useCollectionSidebarState();
	const dispatchExpandNode = useDispatchExpandNode();
	const dispatchCollapseNode = useDispatchCollapseNode();

	function toggle(nodeId: string, expand: boolean) {
		if (expand) {
			dispatchExpandNode(nodeId);
		} else {
			dispatchCollapseNode(nodeId)
		}
	}

	return [sidebarState.expandedNodes, toggle];
}
