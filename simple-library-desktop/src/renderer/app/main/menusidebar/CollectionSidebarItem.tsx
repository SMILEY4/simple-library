import * as React from 'react';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { Collection, CollectionType } from '../../../../common/commonModels';
import { BiImagesSmart } from '../../../components/icons/BiImagesSmart';
import { BiImages } from 'react-icons/all';
import { useContextMenu } from 'react-contexify';
import { COLLECTION_CONTEXT_MENU_ID } from './contextmenues/CollectionContextMenu';
import { useActiveCollection } from '../../../common/hooks/collectionHooks';

interface CollectionSidebarItemProps {
    collection: Collection,
}

export function CollectionSidebarItem(props: React.PropsWithChildren<CollectionSidebarItemProps>): React.ReactElement {

    const { activeCollectionId, setActiveCollection } = useActiveCollection();

    const { show } = useContextMenu({
        id: COLLECTION_CONTEXT_MENU_ID,
        props: {
            collectionId: props.collection.id,
        },
    });

    return <SidebarMenuItem

        title={props.collection.name}
        icon={props.collection.type === CollectionType.SMART ? <BiImagesSmart /> : <BiImages />}
        label={"" + props.collection.itemCount}
        selected={props.collection.id === activeCollectionId}

        draggable={true}
        enableDrop={true}
        highlightDragOver={true}

        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        onDragOver={handleDragOver}
        onDrop={handleDropOn}
        onDragStart={handleDragStart}
    />;


    function handleSelect() {
        setActiveCollection(props.collection.id);
    }

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
