import React from "react";
import {SidebarTab} from "../../../../newcomponents/misc/app/AppLayout";
import {IconType} from "../../../../newcomponents/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../../newcomponents/misc/tree/TreeView";
import {Collection, Group} from "../../../../../common/commonModels";
import {DynamicSlot} from "../../../../newcomponents/base/slot/DynamicSlot";
import {ContextMenuCollection} from "./ContextMenuCollection";
import {ContextMenuGroup} from "./ContextMenuGroup";
import {APP_ROOT_ID} from "../../../application";
import {useGroups} from "../../../hooks/groupHooks";
import {DialogDeleteCollection} from "./DialogDeleteCollection";
import {useCollectionSidebar, useCollectionSidebarDialogs} from "./useCollectionSidebar";
import {DialogDeleteGroup} from "./DialogDeleteGroup";
import {DialogEditGroup} from "./DialogEditGroup";

export const TAB_DATA_COLLECTIONS: SidebarTab = {
	id: "tab-collections",
	title: "Collections",
	icon: IconType.FOLDER
}

interface CollectionSidebarProps {
}

export function CollectionSidebar(props: React.PropsWithChildren<CollectionSidebarProps>): React.ReactElement {

	const {
		rootGroup
	} = useGroups();

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		expandedNodes,
		toggleExpandNode,
		dragStart,
		dragOver,
		drop,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebar();

	const {
		collectionIdDelete,
		openDeleteCollection,
		closeDeleteCollection,

		groupIdDelete,
		openDeleteGroup,
		closeDeleteGroup,

		groupIdEdit,
		openEditGroup,
		closeEditGroup
	} = useCollectionSidebarDialogs();

	return rootGroup && (
		<>
			<TreeView
				rootNode={buildTree(rootGroup)}
				modalRootId={APP_ROOT_ID}
				forceExpanded={expandedNodes}
				onToggleExpand={toggleExpandNode}
				onDragStart={dragStart}
				onDragOver={dragOver}
				onDrop={drop}
			>
				<DynamicSlot name={"context-menu"}>
					{(nodeId: string) => {
						const objectId: number | null = getNodeObjectId(nodeId)
						switch (getNodeType(nodeId)) {
							case NODE_TYPE_COLLECTION: {
								return <ContextMenuCollection
									collectionId={objectId}
									onDelete={() => openDeleteCollection(objectId)}
									onEdit={undefined}
								/>
							}
							case NODE_TYPE_GROUP: {
								return <ContextMenuGroup
									groupId={objectId}
									onDelete={() => openDeleteGroup(objectId)}
									onEdit={() => openEditGroup(objectId)}
								/>
							}
							default: {
								console.error("Cant open context menu - unexpected node type: ", nodeId);
								return null;
							}
						}
					}}
				</DynamicSlot>
			</TreeView>

			{collectionIdDelete && (
				<DialogDeleteCollection
					collectionId={collectionIdDelete}
					onClose={closeDeleteCollection}
				/>
			)}

			{groupIdDelete && (
				<DialogDeleteGroup
					groupId={groupIdDelete}
					onClose={closeDeleteGroup}
				/>
			)}

			{groupIdEdit && (
				<DialogEditGroup
					groupId={groupIdEdit}
					onClose={closeEditGroup}
				/>
			)}

		</>
	)

	function buildTree(group: Group): TreeViewNode {
		return buildGroupTreeNode(group, true);
	}

	function buildGroupTreeNode(group: Group, isRoot: boolean): TreeViewNode {
		return {
			id: getNodeId(NODE_TYPE_GROUP, group.id),
			value: group.name,
			icon: IconType.FOLDER,
			draggable: !isRoot,
			droppable: true,
			isLeaf: false,
			children: [
				...group.children
					.sort((a: Group, b: Group) => a.name.localeCompare(b.name))
					.map(g => buildGroupTreeNode(g, false)),
				...group.collections
					.sort((a: Collection, b: Collection) => a.name.localeCompare(b.name))
					.map(buildCollectionTreeNode)
			]
		}
	}

	function buildCollectionTreeNode(collection: Collection): TreeViewNode {
		return {
			id: getNodeId(NODE_TYPE_COLLECTION, collection.id),
			value: collection.name,
			icon: IconType.FILE,
			label: "" + collection.itemCount,
			draggable: true,
			droppable: true,
			isLeaf: true
		}
	}

}
