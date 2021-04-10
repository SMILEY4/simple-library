import * as React from 'react';
import { Group } from '../../../../../common/commonModels';
import { SidebarMenuGroup } from '../../../../components/sidebarmenu/SidebarMenuGroup';
import { HiOutlineFolder } from 'react-icons/all';
import { CollectionSidebarItem } from './CollectionSidebarItem';
import { useContextMenu } from 'react-contexify';
import { GROUP_CONTEXT_MENU_ID } from './contextmenues/GroupContextMenu';
import { compareCollections, compareGroups } from '../../../common/utils/utils';
import { DragAndDropCollections, DragAndDropGroups, DragAndDropUtils } from '../../../common/dragAndDrop';
import { useGroups } from '../../../hooks/groupHooks';
import { useCollections } from '../../../hooks/collectionHooks';

interface GroupSidebarItemProps {
    group: Group,
}

export function GroupSidebarItem(props: React.PropsWithChildren<GroupSidebarItemProps>): React.ReactElement {

    const { rootGroup, moveGroup } = useGroups();

    const { moveCollection } = useCollections();

    const { show } = useContextMenu({
        id: GROUP_CONTEXT_MENU_ID,
        props: {
            groupId: props.group.id,
        },
    });

    return (
        <SidebarMenuGroup
            title={props.group.name}
            icon={<HiOutlineFolder />}

            enableDrop={true}
            draggable={true}

            onContextMenu={handleContextMenu}
            onDragOver={handleDragOver}
            onDrop={handleDropOn}
            onDragStart={handleDragStart}
        >
            {
                props.group.collections
                    .sort(compareCollections)
                    .map(collection => <CollectionSidebarItem collection={collection} />)
            }
            {
                props.group.children
                    .sort(compareGroups)
                    .map(group => <GroupSidebarItem group={group} />)
            }
        </SidebarMenuGroup>
    );

    function handleContextMenu(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        show(event);
    }

    function handleDragOver(event: React.DragEvent) {
        const dataTransfer: DataTransfer = event.dataTransfer;
        const metaMimeType: string | undefined = DragAndDropUtils.getMetadataMimeType(dataTransfer);
        switch (metaMimeType) {
            case DragAndDropCollections.META_MIME_TYPE: {
                DragAndDropCollections.setDropEffect(dataTransfer);
                break;
            }
            case DragAndDropGroups.META_MIME_TYPE: {
                DragAndDropGroups.setDropEffect(dataTransfer, props.group.id, rootGroup);
                break;
            }
            default: {
                DragAndDropUtils.setDropEffectForbidden(dataTransfer);
            }
        }
    }

    function handleDropOn(event: React.DragEvent) {
        const dataTransfer: DataTransfer = event.dataTransfer;
        const metaMimeType: string | undefined = DragAndDropUtils.getMetadataMimeType(dataTransfer);
        switch (metaMimeType) {
            case DragAndDropCollections.META_MIME_TYPE: {
                const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(dataTransfer);
                moveCollection(dropData.collectionId, props.group.id);
                break;
            }
            case DragAndDropGroups.META_MIME_TYPE: {
                const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(dataTransfer);
                if (DragAndDropGroups.allowDrop(dropData.groupId, props.group.id, rootGroup)) {
                    moveGroup(dropData.groupId, props.group.id);
                }
                break;
            }
            default: {
                DragAndDropUtils.setDropEffectForbidden(dataTransfer);
            }
        }
    }

    function handleDragStart(event: React.DragEvent) {
        DragAndDropGroups.setDragData(event.dataTransfer, props.group.id);
    }
}
