import * as React from 'react';
import { useContextMenu } from 'react-contexify';
import { GROUP_CONTEXT_MENU_ID } from './contextmenues/GroupContextMenu';
import { SidebarMenuGroup } from '../../../components/sidebarmenu/SidebarMenuGroup';
import { HiOutlineFolder } from 'react-icons/all';

interface GroupEntryProps {
    name: string,
    id: number,
    onDragStart: (event: React.DragEvent) => void
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
}

export function GroupEntry(props: React.PropsWithChildren<GroupEntryProps>): React.ReactElement {

    const { show } = useContextMenu({
        id: GROUP_CONTEXT_MENU_ID,
        props: {
            groupId: props.id,
        },
    });

    return (
        <SidebarMenuGroup title={props.name}
                          icon={<HiOutlineFolder />}
                          onContextMenu={(event: React.MouseEvent) => {
                              event.preventDefault();
                              show(event);
                          }}
                          enableDrop={true}
                          onDragOver={(event: React.DragEvent) => props.onDragOver(event)}
                          onDrop={(event: React.DragEvent) => props.onDrop(event)}
                          draggable={true}
                          onDragStart={props.onDragStart}>
            {props.children}
        </SidebarMenuGroup>
    );
}