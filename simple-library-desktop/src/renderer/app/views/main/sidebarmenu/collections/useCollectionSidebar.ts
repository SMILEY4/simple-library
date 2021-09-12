import {useCollectionsState} from "../../../../hooks/base/collectionHooks";
import {useExpandCollapseSidebarNode} from "../../../../hooks/logic/expandCollapseGroupNode";
import {useDragNode} from "../../../../hooks/logic/dragNode";
import {useDragOverNode} from "../../../../hooks/logic/dragOverNode";
import {useDropOnNode} from "../../../../hooks/logic/dropOnNode";
import {useActivateNode} from "../../../../hooks/logic/activateNode";
import {useInitCollectionSidebar} from "../../../../hooks/logic/initCollectionSidebar";

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
