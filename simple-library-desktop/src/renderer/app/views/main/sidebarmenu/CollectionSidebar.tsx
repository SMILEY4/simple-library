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
import {useCollectionSidebar} from "../../../hooks/miscHooks";
import {DragAndDropCollections, DragAndDropGroups, DragAndDropUtils,} from "../../../common/dragAndDrop";
import {useCollections} from "../../../hooks/collectionHooks";

export const TAB_DATA_COLLECTIONS: SidebarTab = {
	id: "tab-collections",
	title: "Collections",
	icon: IconType.FOLDER
}

interface CollectionSidebarProps {
}

export function CollectionSidebar(props: React.PropsWithChildren<CollectionSidebarProps>): React.ReactElement {

	const NODE_TYPE_COLLECTION = "collection"
	const NODE_TYPE_GROUP = "group"

	const {
		rootGroup,
		moveGroup
	} = useGroups();

	const {
		moveCollection
	} = useCollections();

	const {
		collectionSidebarExpandedNodes,
		collectionSidebarToggleExpandedNode
	} = useCollectionSidebar();

	return rootGroup && (
		<TreeView
			rootNode={buildTree(rootGroup)}
			modalRootId={APP_ROOT_ID}
			forceExpanded={collectionSidebarExpandedNodes}
			onToggleExpand={collectionSidebarToggleExpandedNode}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<DynamicSlot name={"context-menu"}>
				{(nodeId: string) => {
					const objectId: string = nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length)
					if (nodeId.startsWith("collection")) {
						return (
							<ContextMenuCollection
								collectionId={objectId}
								onEdit={undefined}
								onDelete={undefined}
							/>
						)
					} else {
						return (
							<ContextMenuGroup
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

	function handleDragStart(nodeId: string, event: React.DragEvent): void {
		switch (getNodeType(nodeId)) {
			case NODE_TYPE_GROUP: {
				DragAndDropGroups.setDragData(event.dataTransfer, getNodeObjectId(nodeId))
				break;
			}
			case NODE_TYPE_COLLECTION: {
				DragAndDropCollections.setDragData(event.dataTransfer, getNodeObjectId(nodeId))
				break;
			}
		}
	}

	function handleDragOver(nodeId: string, event: React.DragEvent): void {
		const targetType: string = getNodeType(nodeId);
		const targetId: number | null = getNodeObjectId(nodeId)
		const sourceMetadataMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);

		switch (targetType) {
			case NODE_TYPE_GROUP: {
				switch (sourceMetadataMimeType) {
					case DragAndDropGroups.META_MIME_TYPE: {
						// drag a 'group' over a 'group'
						DragAndDropGroups.setDropEffect(event.dataTransfer, targetId, rootGroup);
						break;
					}
					case DragAndDropCollections.META_MIME_TYPE: {
						// drag a 'collection' over a 'group'
						DragAndDropCollections.setDropEffect(event.dataTransfer);
						break;
					}
					default: {
						// drag a 'something' over a 'group'
						DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
						break;
					}
				}
				break;
			}
			case NODE_TYPE_COLLECTION: {
				// drag 'something' over a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
				break;
			}
			default: {
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
			}
		}
	}

	function handleDrop(nodeId: string, event: React.DragEvent): void {
		const targetType: string = getNodeType(nodeId);
		const targetId: number | null = getNodeObjectId(nodeId)
		const sourceMetadataMimeType: string = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);

		switch (targetType) {
			case NODE_TYPE_GROUP: {
				switch (sourceMetadataMimeType) {
					case DragAndDropGroups.META_MIME_TYPE: {
						// drop a 'group' on a 'group'
						const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(event.dataTransfer);
						moveGroup(dropData.groupId, targetId)
						break;
					}
					case DragAndDropCollections.META_MIME_TYPE: {
						// drop a 'collection' on a 'group'
						const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(event.dataTransfer);
						moveCollection(dropData.collectionId, targetId);
						break;
					}
					default: {
						// drop a 'something' on a 'group'
						DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
						break;
					}
				}
				break;
			}
			case NODE_TYPE_COLLECTION: {
				// drop 'something' on a 'collection'
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
				break;
			}
			default: {
				DragAndDropUtils.setDropEffectForbidden(event.dataTransfer)
			}
		}
	}

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

	function getNodeId(type: string, id: number): string {
		return type + "." + id
	}

	function getNodeType(nodeId: string): string {
		return nodeId.substring(0, nodeId.indexOf("."))
	}

	function getNodeObjectId(nodeId: string): number | null {
		const id = Number.parseInt(nodeId.substring(nodeId.indexOf(".") + 1, nodeId.length));
		return Number.isNaN(id) ? null : id
	}

}
