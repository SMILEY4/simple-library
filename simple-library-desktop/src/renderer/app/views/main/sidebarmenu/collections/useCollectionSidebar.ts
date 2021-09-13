import {useCollectionsState} from "../../../../hooks/base/collectionHooks";
import {useExpandCollapseSidebarNode} from "../../../../hooks/logic/collectionsidebar/expandCollapseGroupNode";
import {useDragNode} from "../../../../hooks/logic/collectionsidebar/dragNode";
import {useDragOverNode} from "../../../../hooks/logic/collectionsidebar/dragOverNode";
import {useDropOnNode} from "../../../../hooks/logic/collectionsidebar/dropOnNode";
import {useActivateNode} from "../../../../hooks/logic/collectionsidebar/activateNode";
import {useInitCollectionSidebar} from "../../../../hooks/logic/collectionsidebar/initCollectionSidebar";

export function useCollectionSidebar() {

	const {rootGroup} = useCollectionsState();
	const [expandedNodes, expandCollapseNode] = useExpandCollapseSidebarNode();
	const [activeNode, activateNode] = useActivateNode();
	const dragNode = useDragNode();
	const dragOverNode = useDragOverNode();
	const dropOnNode = useDropOnNode();

	useInitCollectionSidebar();

	return {
		activeNode: activeNode,
		expandedNodes: expandedNodes,
		toggleExpandNode: expandCollapseNode,
		rootGroup: rootGroup,
		dragStart: dragNode,
		dragOver: dragOverNode,
		drop: dropOnNode,
		handleDoubleClick: activateNode
	};

}
