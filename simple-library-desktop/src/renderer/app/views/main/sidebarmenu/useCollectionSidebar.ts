import React, {useState} from "react";
import {DragAndDropCollections, DragAndDropGroups, DragAndDropUtils} from "../../../common/dragAndDrop";
import {useGlobalState} from "../../../hooks/old/miscAppHooks";
import {ActionType} from "../../../store/reducer";
import {useGroups} from "../../../hooks/groupHooks";
import {useCollections} from "../../../hooks/collectionHooks";

export function useCollectionSidebar() {

	const NODE_TYPE_COLLECTION = "collection"
	const NODE_TYPE_GROUP = "group"

	const {state, dispatch} = useGlobalState();

	const {
		rootGroup,
		moveGroup
	} = useGroups();

	const {
		moveCollection
	} = useCollections();

	function toggleExpandNode(nodeId: string, expanded: boolean) {
		if (expanded) {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: [...state.collectionSidebarExpandedNodes, nodeId],
			});
		} else {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: state.collectionSidebarExpandedNodes.filter(id => id !== nodeId)
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
				// drag 'something' over a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
				break;
			}
			default: {
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
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
						moveCollection(dropData.collectionId, targetId);
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
				// drop 'something' on a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
				break;
			}
			default: {
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
			}
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
		expandedNodes: state.collectionSidebarExpandedNodes,
		toggleExpandNode: toggleExpandNode,
		dragStart: handleDragStart,
		dragOver: handleDragOver,
		drop: handleDrop,
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
		groupIdDelete,
		setGroupIdDelete
	] = useState(null);


	return {
		collectionIdDelete: collectionIdDelete,
		openDeleteCollection: (collectionId: number) => setCollectionIdDelete(collectionId),
		closeDeleteCollection: () => setCollectionIdDelete(null),

		groupIdDelete: groupIdDelete,
		openDeleteGroup: (groupId: number) => setGroupIdDelete(groupId),
		closeDeleteGroup: () => setGroupIdDelete(null)
	}

}
