import {DragDataContainer, DragOpType} from "../../../../newcomponents/utils/dragAndDropUtils";

export function handleDragStart(nodeId: string): DragDataContainer {
	const nodeType: string = nodeId.substring(0, nodeId.indexOf("."))
	const objectId: string = nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length)
	switch (nodeType) {
		case "collection": {
			return handleDragStartCollection(objectId);
		}
		case "group": {
			return handleDragStartGroup(objectId);
		}
		default: {
			throw "Error when starting dragging " + nodeId + ": Unexpected node type: " + nodeType
		}
	}
}

export function handleDragStartCollection(collectionId: string): DragDataContainer {
	return {
		metaId: "sidebar.collection",
		metaData: {id: collectionId},
		data: {id: collectionId},
		allowedOps: "all"
	};
}


export function handleDragStartGroup(groupId: string): DragDataContainer {
	return {
		metaId: "sidebar.group",
		metaData: {id: groupId},
		data: {id: groupId},
		allowedOps: "all"
	};
}


export function handleDragOver(nodeId: string, metaId: string | null, metadata: any | null): DragOpType {
	const targetNodeType: string = nodeId.substring(0, nodeId.indexOf("."))
	const targetObjectId: string = nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length)
	switch (targetNodeType) {
		case "collection": {
			return handleDragOverCollection(targetObjectId, metaId, metadata);
		}
		case "group": {
			return handleDragOverGroup(targetObjectId, metaId, metadata);
		}
		default: {
			throw "Error when dragging over " + nodeId + ": Unexpected node type: " + targetNodeType
		}
	}
}

export function handleDragOverCollection(targetCollectionId: string, metaId: string | null, metadata: any | null): DragOpType {
	console.log("drag over collection", targetCollectionId, " - ", metaId, metadata)
	return "none"
}

export function handleDragOverGroup(targetGroupId: string, metaId: string | null, metadata: any | null): DragOpType {
	console.log("drag over group", targetGroupId, " - ", metaId, metadata)
	return "move"
}






export function handleDropOn(nodeId: string, metaId: string | null, metadata: any | null, data: any): void {
}