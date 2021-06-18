import React from "react";
import {SidebarTab} from "../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../components/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../../components/misc/tree/TreeView";
import {Collection, CollectionType, Group} from "../../../../../common/commonModels";
import {DynamicSlot} from "../../../../components/base/slot/DynamicSlot";
import {ContextMenuCollection} from "./ContextMenuCollection";
import {ContextMenuGroup} from "./ContextMenuGroup";
import {APP_ROOT_ID} from "../../../Application";
import {DialogDeleteCollection} from "./DialogDeleteCollection";
import {useCollectionSidebar, useCollectionSidebarDialogs} from "../../../hooks/app/useCollectionSidebar";
import {DialogDeleteGroup} from "./DialogDeleteGroup";
import {DialogEditGroup} from "./DialogEditGroup";
import {DialogEditCollection} from "./DialogEditCollection";
import {DialogCreateGroup} from "./DialogCreateGroup";
import {DialogCreateCollection} from "./DialogCreateCollection";
import {useActiveCollection, useCollections} from "../../../hooks/base/collectionHooks";

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
	} = useCollections();

	const {
		activeCollectionId
	} = useActiveCollection();

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		expandedNodes,
		toggleExpandNode,
		dragStart,
		dragOver,
		drop,
		handleDoubleClick,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebar();

	const {
		collectionIdDelete,
		openDeleteCollection,
		closeDeleteCollection,

		collectionIdEdit,
		openEditCollection,
		closeEditCollection,

		groupIdDelete,
		openDeleteGroup,
		closeDeleteGroup,

		groupIdEdit,
		openEditGroup,
		closeEditGroup,

		showCreateGroup,
		parentGroupIdCreateGroup,
		openCreateGroup,
		closeCreateGroup,

		showCreateCollection,
		parentGroupIdCreateCollection,
		openCreateCollection,
		closeCreateCollection

	} = useCollectionSidebarDialogs();

	return rootGroup && (
		<>
			<TreeView
				rootNode={buildTree(rootGroup)}
				modalRootId={APP_ROOT_ID}
				forceExpanded={expandedNodes}
				onToggleExpand={toggleExpandNode}
				onDoubleClick={handleDoubleClick}
				onDragStart={dragStart}
				onDragOver={dragOver}
				onDrop={drop}
				activeNodeId={activeCollectionId ? getNodeId(NODE_TYPE_COLLECTION, activeCollectionId) : undefined}
			>
				<DynamicSlot name={"context-menu"}>
					{(nodeId: string) => {
						const objectId: number | null = getNodeObjectId(nodeId)
						switch (getNodeType(nodeId)) {
							case NODE_TYPE_COLLECTION: {
								return <ContextMenuCollection
									collectionId={objectId}
									onDelete={() => openDeleteCollection(objectId)}
									onEdit={() => {
										console.log("on edit")
										openEditCollection(objectId)
									}}
								/>
							}
							case NODE_TYPE_GROUP: {
								return <ContextMenuGroup
									groupId={objectId}
									onDelete={() => openDeleteGroup(objectId)}
									onEdit={() => openEditGroup(objectId)}
									onCreateCollection={() => openCreateCollection(objectId)}
									onCreateGroup={() => openCreateGroup(objectId)}/>
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

			{collectionIdEdit && (
				<DialogEditCollection
					collectionId={collectionIdEdit}
					onClose={closeEditCollection}
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

			{showCreateGroup && (
				<DialogCreateGroup
					parentGroupId={parentGroupIdCreateGroup}
					onClose={closeCreateGroup}
				/>
			)}

			{showCreateCollection && (
				<DialogCreateCollection
					parentGroupId={parentGroupIdCreateCollection}
					onClose={closeCreateCollection}
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
			icon: collection.type === CollectionType.SMART ? IconType.COLLECTIONS_SMART : IconType.COLLECTION,
			label: "" + collection.itemCount,
			draggable: true,
			droppable: true,
			isLeaf: true
		}
	}

}
