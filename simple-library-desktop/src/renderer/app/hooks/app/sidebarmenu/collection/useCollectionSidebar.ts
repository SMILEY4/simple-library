import React from "react";
import {
	DragAndDropCollections,
	DragAndDropGroups,
	DragAndDropItems,
	DragAndDropUtils
} from "../../../../common/dragAndDrop";
import {useCollections, useCollectionsState} from "../../../base/collectionHooks";
import {useItems} from "../../../base/itemHooks";
import {CollectionSidebarActionType, useCollectionSidebarState} from "../../../../store/collectionSidebarState";
import {useMount} from "../../../../../components/utils/commonHooks";
import {useActiveCollectionState} from "../../../base/activeCollectionHooks";

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

export function useCollectionSidebar() {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const [
		sidebarState,
		sidebarDispatch
	] = useCollectionSidebarState();

	const {
		loadGroups,
		moveGroup,
		moveCollection
	} = useCollections();

	const {
		rootGroup,
		findCollection
	} = useCollectionsState();

	const {
		activeCollectionId,
		openCollection
	} = useActiveCollectionState();

	const {
		loadItems,
		moveOrCopyItems
	} = useItems();

	useMount(() => {
		loadGroups();
	});

	function toggleExpandNode(nodeId: string, expanded: boolean) {
		if (expanded) {
			sidebarDispatch({
				type: CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_ADD,
				payload: nodeId
			});
		} else {
			sidebarDispatch({
				type: CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_REMOVE,
				payload: nodeId
			});
		}
	}

	function handleDragStart(nodeId: string, event: React.DragEvent): void {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP: {
				DragAndDropGroups.setDragData(event.dataTransfer, getNodeObjectId(nodeId));
				break;
			}
			case NODE_TYPE_COLLECTION: {
				DragAndDropCollections.setDragData(event.dataTransfer, getNodeObjectId(nodeId));
				break;
			}
		}
	}

	function handleDragOver(nodeId: string, event: React.DragEvent): void {
		const targetType: string = getNodeType(nodeId);
		const targetId: number | null = getNodeObjectId(nodeId);
		const sourceMetadataMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);

		switch (targetType) {
			case NODE_TYPE_GROUP: {
				switch (sourceMetadataMimeType) {
					case DragAndDropGroups.META_MIME_TYPE: {
						// drag a 'group' over a 'group'
						DragAndDropGroups.setDropEffect(event.dataTransfer, targetId, rootGroup);
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
				break;
			}
			case NODE_TYPE_COLLECTION: {
				switch (sourceMetadataMimeType) {
					case DragAndDropItems.META_MIME_TYPE: {
						// drag 'items' over a 'collection'
						DragAndDropItems.setDropEffect(event.dataTransfer, findCollection(targetId));
						break;
					}
					default: {
						// drag a 'something' over a 'collection'
						DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
						break;
					}
				}
			}
		}
	}

	function handleDrop(nodeId: string, event: React.DragEvent): void {
		const targetType: string = getNodeType(nodeId);
		const targetId: number | null = getNodeObjectId(nodeId);
		const sourceMetadataMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);

		switch (targetType) {
			case NODE_TYPE_GROUP: {
				switch (sourceMetadataMimeType) {
					case DragAndDropGroups.META_MIME_TYPE: {
						// drop a 'group' on a 'group'
						const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(event.dataTransfer);
						moveGroup(dropData.groupId, targetId);
						break;
					}
					case DragAndDropCollections.META_MIME_TYPE: {
						// drop a 'collection' on a 'group'
						const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(event.dataTransfer);
						moveCollection(dropData.collectionId, targetId).then(() => loadGroups());
						break;
					}
					default: {
						// drop a 'something' on a 'group'
						DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
						break;
					}
				}
				break;
			}
			case NODE_TYPE_COLLECTION: {
				switch (sourceMetadataMimeType) {
					case DragAndDropItems.META_MIME_TYPE: {
						// drop 'items' on a 'collection'
						const dropData: DragAndDropItems.Data = DragAndDropItems.getDragData(event.dataTransfer);
						moveOrCopyItems(dropData.sourceCollectionId, targetId, dropData.itemIds, dropData.copy)
							.then(() => loadItems(activeCollectionId))
							.then(() => loadGroups());
						break;
					}
					default: {
						// drop 'something' on a 'collection'
						DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
						break;
					}
				}
			}
		}
	}

	function handleDoubleClick(nodeId: string) {
		if (getNodeType(nodeId) === NODE_TYPE_COLLECTION) {
			const collectionId: number = getNodeObjectId(nodeId);
			openCollection(collectionId);
			loadItems(collectionId);
		} else {
			console.error("Double-Click on unexpected element:", nodeId);
		}
	}

	return {
		activeNode: activeCollectionId ? getNodeId(NODE_TYPE_COLLECTION, activeCollectionId) : undefined,
		expandedNodes: sidebarState.expandedNodes,
		toggleExpandNode: toggleExpandNode,
		rootGroup: rootGroup,
		dragStart: handleDragStart,
		dragOver: handleDragOver,
		drop: handleDrop,
		handleDoubleClick: handleDoubleClick
	};

}
