import * as React from 'react';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { Collection } from '../../../../common/commonModels';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImages, BiImport, HiOutlineRefresh, HiPlus } from 'react-icons/all';
import { DialogCreateCollection } from './DialogCreateCollection';
import { COLLECTION_CONTEXT_MENU_ID, CollectionContextMenu } from './CollectionContextMenu';
import { useContextMenu } from 'react-contexify';
import { DialogDeleteCollection } from './DialogDeleteCollection';


export interface MenuSidebarProps {
    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void,

    collections: Collection[],
    activeCollectionId: number | undefined,
    onSelectCollection: (collectionId: number | undefined) => void,

    onDragOverCollection: (collectionId: number | undefined, event: React.DragEvent) => void,
    onDropOnCollection: (collectionId: number | undefined, event: React.DragEvent) => void,

    minimized: boolean,
    onSetMinimize: (mini: boolean) => void,

    showDialogCreateCollection: boolean,
    onCreateCollection: () => void,
    onCreateCollectionCancel: () => void,
    onCreateCollectionAccept: (collectionName: string) => void

    showDialogDeleteCollection: boolean,
    deleteCollectionName: string | undefined
    onDeleteCollectionCancel: () => void,
    onDeleteCollectionAccept: () => void,

    onContextMenuActionRename: (collectionId: number) => void
    onContextMenuActionDelete: (collectionId: number) => void
}

export function MenuSidebar(props: React.PropsWithChildren<MenuSidebarProps>): React.ReactElement {

    return (
        <SidebarMenu fillHeight
                     minimizable={true}
                     minimized={props.minimized}
                     onToggleMinimized={props.onSetMinimize}
                     style={{ width: 'var(--s-12)' }}>

            <SidebarMenuSection title='Actions'>
                <MenuActionImport onAction={props.onActionImport} />
                <MenuActionRefresh onAction={props.onActionRefresh} />
                <MenuActionClose onAction={props.onActionClose} />
            </SidebarMenuSection>

            <SidebarMenuSection title='Collections' actionButtonIcon={<HiPlus />} onAction={props.onCreateCollection}>
                {props.collections.map(collection => {
                    return <MenuCollection name={collection.name}
                                           id={collection.id}
                                           key={collection.id ? collection.id : -1}
                                           itemCount={collection.itemCount}
                                           selectedId={props.activeCollectionId}
                                           onSelect={props.onSelectCollection}
                                           onDragOver={(event: React.DragEvent) => props.onDragOverCollection(collection.id, event)}
                                           onDrop={(event: React.DragEvent) => props.onDropOnCollection(collection.id, event)} />;
                })}
            </SidebarMenuSection>

            {props.showDialogCreateCollection && (
                <DialogCreateCollection
                    onClose={props.onCreateCollectionCancel}
                    onCreate={props.onCreateCollectionAccept}
                />
            )}

            {props.showDialogDeleteCollection && (
                <DialogDeleteCollection
                    collectionName={props.deleteCollectionName}
                    onClose={props.onDeleteCollectionCancel}
                    onDelete={props.onDeleteCollectionAccept}
                />
            )}

            <CollectionContextMenu
                onActionRename={props.onContextMenuActionRename}
                onActionDelete={props.onContextMenuActionDelete}
            />

        </SidebarMenu>
    );
}


interface SimpleMenuActionProps {
    onAction: () => void,
}

function MenuActionImport(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Import"}
        icon={<BiImport />}
        onClick={props.onAction}
    />;
}

function MenuActionRefresh(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Refresh"}
        icon={<HiOutlineRefresh />}
        onClick={props.onAction}
    />;
}

function MenuActionClose(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Close"}
        icon={<AiOutlineCloseCircle />}
        onClick={props.onAction}
    />;
}


interface MenuCollectionProps {
    name: string,
    id: number | undefined,
    itemCount: number,
    selectedId: number | undefined,
    onSelect: (id: number | undefined) => void,
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
}

function MenuCollection(props: React.PropsWithChildren<MenuCollectionProps>): React.ReactElement {

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
                            onDragOver={(event) => props.onDragOver(event)}
                            onDrop={(event) => props.onDrop(event)} />;
}