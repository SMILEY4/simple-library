import * as React from 'react';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { Collection } from '../../../../common/commonModels';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImages, BiImport, HiOutlineRefresh } from 'react-icons/all';


export interface MenuSidebarProps {
    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void

    collections: Collection[],
    activeCollectionId: number | undefined,
    onSelectCollection: (collectionId: number | undefined) => void

    onDragOverCollection: (collectionId: number | undefined, event: React.DragEvent) => void
    onDropOnCollection: (collectionId: number | undefined, event: React.DragEvent) => void

    minimized: boolean,
    onSetMinimize: (mini: boolean) => void
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

            <SidebarMenuSection title='Collections'>
                {props.collections.map(collection => {
                    return <MenuCollection name={collection.name}
                                           id={collection.id}
                                           key={collection.id ? collection.id : -1}
                                           itemCount={collection.itemCount}
                                           selectedId={props.activeCollectionId}
                                           onSelect={props.onSelectCollection}
                                           onDragOver={(event: React.DragEvent) => props.onDragOverCollection(collection.id, event)}
                                           onDrop={(event: React.DragEvent) => props.onDropOnCollection(collection.id, event)} />
                })}
            </SidebarMenuSection>

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
    return <SidebarMenuItem title={props.name}
                            icon={<BiImages />}
                            label={"" + props.itemCount}
                            selected={props.selectedId === props.id}
                            onClick={() => props.onSelect(props.id)}
                            enableDrop={true}
                            onDragOver={(event) => props.onDragOver(event)}
                            onDrop={(event) => props.onDrop(event)} />;
}