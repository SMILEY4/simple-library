import React from "react";
import {SidebarTab} from "../../../newcomponents/misc/app/AppLayout";
import {IconType} from "../../../newcomponents/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../newcomponents/misc/tree/TreeView";
import {useGlobalState, useNotifications} from "../../hooks/miscAppHooks";
import {ActionType} from "../../store/reducer";
import {getTreeData} from "../../../newcomponents/_showcase/sampleData";
import {useGroups} from "../../hooks/groupHooks";
import {componentDidMount} from "../../common/utils/functionalReactLifecycle";
import {fetchRootGroup} from "../../common/messaging/messagingInterface";
import {genNotificationId} from "../../common/utils/notificationUtils";
import {AppNotificationType} from "../../store/state";
import {Collection, Group} from "../../../../common/commonModels";

export const TAB_DATA_COLLECTIONS: SidebarTab = {
	id: "tab-collections",
	title: "Collections",
	icon: IconType.FOLDER
}

interface CollectionSidebarProps {
}

export function CollectionSidebar(props: React.PropsWithChildren<CollectionSidebarProps>): React.ReactElement {

	const {state, dispatch} = useGlobalState();
	const {rootGroup, setRootGroup} = useGroups();
	const {addNotification} = useNotifications();

	componentDidMount(() => {
		fetchRootGroup()
			.then(setRootGroup)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error));
	})

	return rootGroup && (
		<TreeView
			rootNode={buildTree(rootGroup)}
			modalRootId={"showcase-root"}
			forceExpanded={state.collectionSidebarExpanded}
			onToggleExpand={handleToggleExpandNode}
		/>
	)

	function buildTree(group: Group): TreeViewNode {
		return buildGroupTreeNode(group);
	}


	function buildGroupTreeNode(group: Group): TreeViewNode {
		return {
			id: "group." + group.id,
			value: group.name,
			icon: IconType.FOLDER,
			draggable: true,
			droppable: true,
			isLeaf: false,
			children: [
				...group.children
					.sort((a: Group, b: Group) => a.name.localeCompare(b.name))
					.map(buildGroupTreeNode),
				...group.collections
					.sort((a: Collection, b: Collection) => a.name.localeCompare(b.name))
					.map(buildCollectionTreeNode)
			]
		}
	}

	function buildCollectionTreeNode(collection: Collection): TreeViewNode {
		return {
			id: "collection." + collection.id,
			value: collection.name,
			icon: IconType.FILE,
			label: "" + collection.itemCount,
			draggable: true,
			droppable: true,
			isLeaf: true
		}
	}

	function handleToggleExpandNode(nodeId: string, expanded: boolean): void {
		if (expanded) {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: [...state.collectionSidebarExpanded, nodeId],
			});
		} else {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: state.collectionSidebarExpanded.filter(id => id !== nodeId)
			});
		}
	}


}
