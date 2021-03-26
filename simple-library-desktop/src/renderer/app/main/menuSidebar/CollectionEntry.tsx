import * as React from 'react';
import { useContextMenu } from 'react-contexify';
import { COLLECTION_CONTEXT_MENU_ID } from './contextmenues/CollectionContextMenu';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { BiImages } from 'react-icons/all';

interface CollectionEntryProps {
    name: string,
    id: number | undefined,
    itemCount: number,
    selectedId: number | undefined,
    onSelect: (id: number | undefined) => void,
    onDragStart: (event: React.DragEvent) => void
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
}

export function CollectionEntry(props: React.PropsWithChildren<CollectionEntryProps>): React.ReactElement {

    const { show } = useContextMenu({
        id: COLLECTION_CONTEXT_MENU_ID,
        props: {
            collectionId: props.id,
        },
    });

    return <SidebarMenuItem title={props.name}
                            icon={<BiImages />}
                            label={"" + props.itemCount}
                            selected={props.selectedId === props.id}
                            onClick={() => props.onSelect(props.id)}
                            onContextMenu={(event: React.MouseEvent) => {
                                event.preventDefault();
                                show(event);
                            }}
                            enableDrop={true}
                            onDragOver={(event: React.DragEvent) => props.onDragOver(event)}
                            onDrop={(event: React.DragEvent) => props.onDrop(event)}
                            draggable={true}
                            onDragStart={props.onDragStart} />;
}

