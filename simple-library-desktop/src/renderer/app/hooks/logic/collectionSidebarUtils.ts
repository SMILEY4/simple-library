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
