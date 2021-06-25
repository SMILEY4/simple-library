import React from "react";
import {SidebarTab} from "../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../components/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../../components/misc/tree/TreeView";
import {Collection, CollectionType, Group} from "../../../../../common/commonModels";
import {DynamicSlot} from "../../../../components/base/slot/DynamicSlot";
import {ContextMenuCollection} from "./contextmenues/ContextMenuCollection";
import {ContextMenuGroup} from "./contextmenues/ContextMenuGroup";
import {APP_ROOT_ID} from "../../../Application";
import {DialogDeleteCollection} from "./dialogs/DialogDeleteCollection";
import {useCollectionSidebar, useCollectionSidebarUtils} from "../../../hooks/app/sidebarmenu/useCollectionSidebar";
import {DialogDeleteGroup} from "./dialogs/DialogDeleteGroup";
import {DialogEditGroup} from "./dialogs/DialogEditGroup";
import {DialogEditCollection} from "./dialogs/DialogEditCollection";
import {DialogCreateGroup} from "./dialogs/DialogCreateGroup";
import {DialogCreateCollection} from "./dialogs/DialogCreateCollection";
import {useDialogCollectionDeleteController} from "../../../hooks/app/sidebarmenu/useDialogCollectionDelete";
import {useDialogCollectionCreateController} from "../../../hooks/app/sidebarmenu/useDialogCollectionCreate";
import {useDialogCollectionEditController} from "../../../hooks/app/sidebarmenu/useDialogCollectionEdit";
import {useDialogGroupDeleteController} from "../../../hooks/app/sidebarmenu/useDialogGroupDelete";
import {useDialogGroupEditController} from "../../../hooks/app/sidebarmenu/useDialogGroupEdit";
import {useDialogGroupCreateController} from "../../../hooks/app/sidebarmenu/useDialogGroupCreate";

export const TAB_DATA_COLLECTIONS: SidebarTab = {
	id: "tab-collections",
	title: "Collections",
	icon: IconType.FOLDER
}

interface CollectionSidebarProps {
}

export function CollectionSidebar(props: React.PropsWithChildren<CollectionSidebarProps>): React.ReactElement {

	const {
		NODE_TYPE_COLLECTION,
		NODE_TYPE_GROUP,
		getNodeId,
		getNodeType,
		getNodeObjectId
	} = useCollectionSidebarUtils();

	const {
		activeNode,
		expandedNodes,
		toggleExpandNode,
		rootGroup,
		dragStart,
		dragOver,
		drop,
		handleDoubleClick,
	} = useCollectionSidebar();

	const [
		showDeleteCollection,
		openDeleteCollection,
		closeDeleteCollection,
		idDeleteCollection
	] = useDialogCollectionDeleteController()

	const [
		showCreateCollection,
		openCreateCollection,
		closeCreateCollection,
		idCreateCollectionParent
	] = useDialogCollectionCreateController()

	const [
		showEditCollection,
		openEditCollection,
		closeEditCollection,
		idEditCollection
	] = useDialogCollectionEditController()

	const [
		showDeleteGroup,
		openDeleteGroup,
		closeDeleteGroup,
		idDeleteGroup
	] = useDialogGroupDeleteController()

	const [
		showCreateGroup,
		openCreateGroup,
		closeCreateGroup,
		idCreateGroupParent
	] = useDialogGroupCreateController()

	const [
		showEditGroup,
		openEditGroup,
		closeEditGroup,
		idEditGroup
	] = useDialogGroupEditController()


	return !!rootGroup ? (
		<>
			<TreeView
				rootNode={buildTree(rootGroup)}
				modalRootId={APP_ROOT_ID}
				forceExpanded={expandedNodes}
				withSearch
				onToggleExpand={toggleExpandNode}
				onDoubleClick={handleDoubleClick}
				onDragStart={dragStart}
				onDragOver={dragOver}
				onDrop={drop}
				activeNodeId={activeNode}
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

			{showDeleteCollection && (
				<DialogDeleteCollection
					collectionId={idDeleteCollection}
					onClose={closeDeleteCollection}
				/>
			)}

			{showEditCollection && (
				<DialogEditCollection
					collectionId={idEditCollection}
					onClose={closeEditCollection}
				/>
			)}

			{showDeleteGroup && (
				<DialogDeleteGroup
					groupId={idDeleteGroup}
					onClose={closeDeleteGroup}
				/>
			)}

			{showEditGroup && (
				<DialogEditGroup
					groupId={idEditGroup}
					onClose={closeEditGroup}
				/>
			)}

			{showCreateGroup && (
				<DialogCreateGroup
					parentGroupId={idCreateGroupParent}
					onClose={closeCreateGroup}
				/>
			)}

			{showCreateCollection && (
				<DialogCreateCollection
					parentGroupId={idCreateCollectionParent}
					onClose={closeCreateCollection}
				/>
			)}

		</>
	) : null

	function buildTree(group: Group): TreeViewNode {
		return buildGroupTreeNode(group, true);
	}

	function buildGroupTreeNode(group: Group, isRoot: boolean): TreeViewNode {
		return {
			id: getNodeId(NODE_TYPE_GROUP, group.id),
			value: isRoot ? "Collections" : group.name,
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
