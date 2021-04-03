import * as React from 'react';
import { Group } from '../../../../common/commonModels';
import { SidebarMenuGroup } from '../../../components/sidebarmenu/SidebarMenuGroup';
import { HiOutlineFolder } from 'react-icons/all';
import { CollectionSidebarItem } from './CollectionSidebarItem';
import { useContextMenu } from 'react-contexify';
import { GROUP_CONTEXT_MENU_ID } from './contextmenues/GroupContextMenu';
import { compareCollections, compareGroups } from '../../../common/utils/utils';

interface GroupSidebarItemProps {
    group: Group,
}

export function GroupSidebarItem(props: React.PropsWithChildren<GroupSidebarItemProps>): React.ReactElement {

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
        // todo
    }

    function handleDropOn(event: React.DragEvent) {
        // todo
    }

    function handleDragStart(event: React.DragEvent) {
        // todo
    }
}
