import * as React from 'react';
import { SidebarMenuItem } from '../../../../components/sidebarmenu/SidebarMenuItem';
import { Collection, CollectionType } from '../../../../../common/commonModels';
import { BiImagesSmart } from '../../../../components/icons/BiImagesSmart';
import { BiImages } from 'react-icons/all';
import { useContextMenu } from 'react-contexify';
import { COLLECTION_CONTEXT_MENU_ID } from './contextmenues/CollectionContextMenu';
import { useCollections } from '../../../hooks/collectionHooks';
import { DragAndDropCollections, DragAndDropItems, DragAndDropUtils } from '../../../common/dragAndDrop';
import { isCopyMode } from '../../../common/utils/utils';
import { useItems } from '../../../hooks/itemHooks';

interface CollectionSidebarItemProps {
    collection: Collection,
}

export function CollectionSidebarItem(props: React.PropsWithChildren<CollectionSidebarItemProps>): React.ReactElement {

    const { activeCollectionId, setActiveCollection } = useCollections();

    const { moveItems, copyItems } = useItems();

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
        const metadataMimeType: string | undefined = DragAndDropUtils.getMetadataMimeType(event.dataTransfer);
        if (metadataMimeType === DragAndDropItems.META_MIME_TYPE) {
            DragAndDropItems.setDropEffect(event.dataTransfer, props.collection);
        } else {
            DragAndDropUtils.setDropEffectForbidden(event.dataTransfer);
        }
    }

    function handleDropOn(event: React.DragEvent) {
        if (DragAndDropUtils.getMetadataMimeType(event.dataTransfer) === DragAndDropItems.META_MIME_TYPE) {
            const dropData: DragAndDropItems.Data = DragAndDropItems.getDragData(event.dataTransfer);
            const srcCollectionId: number = dropData.sourceCollectionId;
            if (srcCollectionId !== props.collection.id) {
                if (isCopyMode(event)) {
                    moveItems(dropData.itemIds, srcCollectionId, props.collection.id);
                } else {
                    copyItems(dropData.itemIds, srcCollectionId, props.collection.id);
                }
            }
        }
    }

    function handleDragStart(event: React.DragEvent) {
        DragAndDropCollections.setDragData(event.dataTransfer, props.collection.id);
    }
}
