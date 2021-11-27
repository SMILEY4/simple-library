import React from "react";
import {SidebarTab} from "../../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../../components/base/icon/Icon";
import {TreeView, TreeViewNode} from "../../../../../components/misc/tree/TreeView";
import {DynamicSlot} from "../../../../../components/base/slot/DynamicSlot";
import {ContextMenuCollection} from "./contextmenues/ContextMenuCollection";
import {ContextMenuGroup} from "./contextmenues/ContextMenuGroup";
import {APP_ROOT_ID} from "../../../../Application";
import {DialogDeleteCollection} from "./dialogs/DialogDeleteCollection";
import {DialogDeleteGroup} from "./dialogs/DialogDeleteGroup";
import {DialogEditGroup} from "./dialogs/DialogEditGroup";
import {DialogEditCollection} from "./dialogs/DialogEditCollection";
import {DialogCreateGroup} from "./dialogs/DialogCreateGroup";
import {DialogCreateCollection} from "./dialogs/DialogCreateCollection";
import {CollectionDTO, GroupDTO} from "../../../../../../common/events/dtoModels";
import {useCollectionSidebar, useCollectionSidebarUtils} from "./useCollectionSidebar";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../../hooks/store/dialogState";

export const TAB_DATA_COLLECTIONS: SidebarTab = {
	id: "tab-collections",
	title: "Collections",
	icon: IconType.FOLDER
}

interface CollectionSidebarProps {
}

export function CollectionSidebar(props: React.PropsWithChildren<CollectionSidebarProps>): React.ReactElement {

	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

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

	console.log(rootGroup)

	return !!rootGroup ? (
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
								onDelete={() => openDialogDeleteCollection(objectId)}
								onEdit={() => {
									openDialogEditCollection(objectId)
								}}
							/>
						}
						case NODE_TYPE_GROUP: {
							return <ContextMenuGroup
								groupId={objectId}
								onDelete={() => openDialogDeleteGroup(objectId)}
								onEdit={() => openDialogEditGroup(objectId)}
								onCreateCollection={() => openDialogCreateCollection(objectId)}
								onCreateGroup={() => openDialogCreateGroup(objectId)}/>
						}
						default: {
							console.error("Cant open context menu - unexpected node type: ", nodeId);
							return null;
						}
					}
				}}
			</DynamicSlot>
		</TreeView>
	) : null

	function buildTree(group: GroupDTO): TreeViewNode {
		return buildGroupTreeNode(group, true);
	}

	function buildGroupTreeNode(group: GroupDTO, isRoot: boolean): TreeViewNode {
		return {
			id: getNodeId(NODE_TYPE_GROUP, group.id),
			value: isRoot ? "Collections" : group.name,
			icon: IconType.FOLDER,
			draggable: !isRoot,
			droppable: true,
			isLeaf: false,
			children: [
				...group.children
					.sort((a: GroupDTO, b: GroupDTO) => a.name.localeCompare(b.name))
					.map(g => buildGroupTreeNode(g, false)),
				...group.collections
					.sort((a: CollectionDTO, b: CollectionDTO) => a.name.localeCompare(b.name))
					.map(buildCollectionTreeNode)
			]
		}
	}

	function buildCollectionTreeNode(collection: CollectionDTO): TreeViewNode {
		return {
			id: getNodeId(NODE_TYPE_COLLECTION, collection.id),
			value: collection.name,
			icon: collection.type === "smart" ? IconType.COLLECTIONS_SMART : IconType.COLLECTION,
			label: "" + collection.itemCount,
			draggable: true,
			droppable: true,
			isLeaf: true
		}
	}

	function openDialogDeleteCollection(collectionId: number) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogDeleteCollection
				collectionId={collectionId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function openDialogEditCollection(collectionId: number) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogEditCollection
				collectionId={collectionId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function openDialogDeleteGroup(groupId: number) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogDeleteGroup
				groupId={groupId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function openDialogEditGroup(groupId: number) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogEditGroup
				groupId={groupId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function openDialogCreateGroup(parentGroupId: number | null) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogCreateGroup
				parentGroupId={parentGroupId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

	function openDialogCreateCollection(parentGroupId: number | null) {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogCreateCollection
				parentGroupId={parentGroupId}
				onClose={() => closeDialog(id)}
			/>
		}));
	}

}
