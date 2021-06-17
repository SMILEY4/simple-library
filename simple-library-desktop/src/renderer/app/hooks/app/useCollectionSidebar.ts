import React, {useState} from "react";
import {
	DragAndDropCollections,
	DragAndDropGroups,
	DragAndDropItems,
	DragAndDropUtils
} from "../../common/dragAndDrop";
import {useGroups} from "../base/groupHooks";
import {useCollections} from "../base/collectionHooks";
import {useItems, useItemSelection} from "../base/itemHooks";
import {CollectionSidebarActionType, useCollectionSidebarState} from "../../store/collectionSidebarState";

export function useCollectionSidebar() {

	const NODE_TYPE_COLLECTION = "collection"
	const NODE_TYPE_GROUP = "group"

	const [
		sidebarState,
		sidebarDispatch
	] = useCollectionSidebarState()

	const {
		rootGroup,
		loadGroups,
		moveGroup
	} = useGroups();

	const {
		activeCollectionId,
		moveCollection,
		openCollection,
		findCollection,
	} = useCollections();

	const {
		loadItems,
		moveOrCopyItems
	} = useItems()

	const {
		clearSelection
	} = useItemSelection();

	function toggleExpandNode(nodeId: string, expanded: boolean) {
		if (expanded) {
			sidebarDispatch({
				type: CollectionSidebarActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: [...sidebarState.expandedNodes, nodeId],
			});
		} else {
			sidebarDispatch({
				type: CollectionSidebarActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: sidebarState.expandedNodes.filter(id => id !== nodeId)
			});
		}
	}

	function handleDragStart(nodeId: string, event: React.DragEvent): void {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP: {
				DragAndDropGroups.setDragData(event.dataTransfer, getNodeObjectId(nodeId))
				break;
			}
			case NODE_TYPE_COLLECTION: {
				DragAndDropCollections.setDragData(event.dataTransfer, getNodeObjectId(nodeId))
				break;
			}
		}
	}

	function handleDragOver(nodeId: string, event: React.DragEvent): void {
		const targetType: string = getNodeType(nodeId);
		const targetId: number | null = getNodeObjectId(nodeId)
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
						DragAndDropItems.setDropEffect(event.dataTransfer, findCollection(targetId))
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
		const targetId: number | null = getNodeObjectId(nodeId)
		const sourceMetadataMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);

		switch (targetType) {
			case NODE_TYPE_GROUP: {
				switch (sourceMetadataMimeType) {
					case DragAndDropGroups.META_MIME_TYPE: {
						// drop a 'group' on a 'group'
						const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(event.dataTransfer);
						moveGroup(dropData.groupId, targetId)
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
						const dropData: DragAndDropItems.Data = DragAndDropItems.getDragData(event.dataTransfer)
						moveOrCopyItems(dropData.sourceCollectionId, targetId, dropData.itemIds, dropData.copy)
							.then(() => loadItems(activeCollectionId))
							.then(() => loadGroups())
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
			const collectionId: number = getNodeObjectId(nodeId)
			openCollection(collectionId)
			clearSelection();
			loadItems(collectionId)
		} else {
			console.error("Double-Click on unexpected element:", nodeId)
		}
	}

	function getNodeId(type: string, id: number): string {
		return type + "." + id
	}

	function getNodeType(nodeId: string): string {
		return nodeId.substring(0, nodeId.indexOf("."))
	}

	function getNodeObjectId(nodeId: string): number | null {
		const id = Number.parseInt(nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length));
		return Number.isNaN(id) ? null : id
	}

	return {
		NODE_TYPE_COLLECTION: NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP: NODE_TYPE_GROUP,
		expandedNodes: sidebarState.expandedNodes,
		toggleExpandNode: toggleExpandNode,
		dragStart: handleDragStart,
		dragOver: handleDragOver,
		drop: handleDrop,
		handleDoubleClick: handleDoubleClick,
		getNodeId: getNodeId,
		getNodeType: getNodeType,
		getNodeObjectId: getNodeObjectId
	}

}


export function useCollectionSidebarDialogs() {

	const [
		collectionIdDelete,
		setCollectionIdDelete,
	] = useState(null);

	const [
		collectionIdEdit,
		setCollectionIdEdit
	] = useState(null);

	const [
		groupIdDelete,
		setGroupIdDelete
	] = useState(null);

	const [
		groupIdEdit,
		setGroupIdEdit
	] = useState(null);

	const [
		parentGroupIdCreateGroup,
		setParentGroupIdCreateGroup
	] = useState(null);
	const [
		showCreateGroup,
		setShowCreateGroup
	] = useState(false);

	const [
		parentGroupIdCreateCollection,
		setParentGroupIdCreateCollection
	] = useState(null);
	const [
		showCreateCollection,
		setShowCreateCollection
	] = useState(false);

	return {
		collectionIdDelete: collectionIdDelete,
		openDeleteCollection: (collectionId: number) => setCollectionIdDelete(collectionId),
		closeDeleteCollection: () => setCollectionIdDelete(null),

		collectionIdEdit: collectionIdEdit,
		openEditCollection: (collectionId: number) => setCollectionIdEdit(collectionId),
		closeEditCollection: () => setCollectionIdEdit(null),

		groupIdDelete: groupIdDelete,
		openDeleteGroup: (groupId: number) => setGroupIdDelete(groupId),
		closeDeleteGroup: () => setGroupIdDelete(null),

		groupIdEdit: groupIdEdit,
		openEditGroup: (groupId: number) => setGroupIdEdit(groupId),
		closeEditGroup: () => setGroupIdEdit(null),

		showCreateGroup: showCreateGroup,
		parentGroupIdCreateGroup: parentGroupIdCreateGroup,
		openCreateGroup: (groupId: number) => {
			setShowCreateGroup(true)
			setParentGroupIdCreateGroup(groupId)
		},
		closeCreateGroup: () => {
			setParentGroupIdCreateGroup(null)
			setShowCreateGroup(false)
		},

		showCreateCollection: showCreateCollection,
		parentGroupIdCreateCollection: parentGroupIdCreateCollection,
		openCreateCollection: (groupId: number) => {
			setShowCreateCollection(true)
			setParentGroupIdCreateCollection(groupId)
		},
		closeCreateCollection: () => {
			setParentGroupIdCreateCollection(null)
			setShowCreateCollection(false)
		}
	}

}
