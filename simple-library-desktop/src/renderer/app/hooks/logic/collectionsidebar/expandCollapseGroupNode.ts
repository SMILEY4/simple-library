import {
	useCollectionSidebarState,
	useDispatchCollapseNode,
	useDispatchExpandNode
} from "../../../store/collectionSidebarState";

export function useExpandCollapseSidebarNode(): [string[], (nodeId: string, expand: boolean) => void] {

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
