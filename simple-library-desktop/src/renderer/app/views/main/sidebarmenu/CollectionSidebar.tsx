import React from "react";
import {SidebarTab} from "../../../../newcomponents/misc/app/AppLayout";
import {IconType} from "../../../../newcomponents/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../../newcomponents/misc/tree/TreeView";
import {useGlobalState, useNotificationsOld} from "../../../hooks/old/miscAppHooks";
import {ActionType} from "../../../store/reducer";
import {useGroups} from "../../../hooks/old/groupHooks";
import {componentDidMount} from "../../../common/utils/functionalReactLifecycle";
import {fetchRootGroup} from "../../../common/messaging/messagingInterface";
import {genNotificationId} from "../../../common/utils/notificationUtils";
import {AppNotificationType} from "../../../store/state";
import {Collection, Group} from "../../../../../common/commonModels";
import {DynamicSlot} from "../../../../newcomponents/base/slot/DynamicSlot";
import {CollectionContextMenu} from "./CollectionContextMenu";
import {GroupContextMenu} from "./GroupContextMenu";
import {DragDataContainer, DragOpType} from "../../../../newcomponents/utils/dragAndDropUtils";
import {APP_ROOT_ID} from "../../../application";
import {handleDragOver, handleDragStart, handleDropOn} from "./sidebarMenuDragAndDrop";

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
	const {addNotification} = useNotificationsOld();

	componentDidMount(() => {
		fetchRootGroup()
			.then(setRootGroup)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error));
	})

	return rootGroup && (
		<TreeView
			rootNode={buildTree(rootGroup)}
			modalRootId={APP_ROOT_ID}
			forceExpanded={state.collectionSidebarExpanded}
			onToggleExpand={handleToggleExpandNode}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDrop={handleDropOn}
		>
			<DynamicSlot name={"context-menu"}>
				{(nodeId: string) => {
					const objectId: string = nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length)
					if (nodeId.startsWith("collection")) {
						return (
							<CollectionContextMenu
								collectionId={objectId}
								onEdit={undefined}
								onDelete={undefined}
							/>
						)
					} else {
						return (
							<GroupContextMenu
								groupId={objectId}
								onCreateGroup={undefined}
								onCreateCollection={undefined}
								onEdit={undefined}
								onDelete={undefined}
							/>
						)
					}
				}}
			</DynamicSlot>
		</TreeView>
	)

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


}
