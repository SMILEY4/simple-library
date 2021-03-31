import * as React from 'react';
import { useContextMenu } from 'react-contexify';
import { COLLECTION_CONTEXT_MENU_ID } from './contextmenues/CollectionContextMenu';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { Collection, CollectionType } from '../../../../common/commonModels';
import { BiImagesSmart } from '../../../components/icons/BiImagesSmart';
import { BiImages } from 'react-icons/all';

interface CollectionEntryProps {
    collection: Collection,
    selectedId: number | null,
    onSelect: (id: number | null) => void,
    onDragStart: (event: React.DragEvent) => void
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
}

export function CollectionEntry(props: React.PropsWithChildren<CollectionEntryProps>): React.ReactElement {

    const { show } = useContextMenu({
        id: COLLECTION_CONTEXT_MENU_ID,
        props: {
            collectionId: props.collection.id,
        },
    });

    return <SidebarMenuItem title={props.collection.name}
                            icon={props.collection.type === CollectionType.SMART ? <BiImagesSmart /> : <BiImages />}
                            label={"" + props.collection.itemCount}
                            selected={props.selectedId === props.collection.id}
                            onClick={() => props.onSelect(props.collection.id)}
                            onContextMenu={(event: React.MouseEvent) => {
                                event.preventDefault();
                                show(event);
                            }}
                            enableDrop={true}
                            onDragOver={(event: React.DragEvent) => props.onDragOver(event)}
                            onDrop={(event: React.DragEvent) => props.onDrop(event)}
                            draggable={true}
                            onDragStart={(event: React.DragEvent) => props.onDragStart(event)}
                            highlightDragOver={true} />;
}

