import * as React from 'react';
import { ReactElement } from 'react';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { Collection, Group } from '../../../../common/commonModels';
import { CollectionContextMenu } from './contextmenues/CollectionContextMenu';
import { GroupContextMenu } from './contextmenues/GroupContextMenu';
import { GroupEntry } from './GroupEntry';
import { CollectionEntry } from './CollectionEntry';
import { CollectionSectionAction, MenuActionClose, MenuActionImport, MenuActionRefresh } from './sidebarEntries';


export interface MenuSidebarProps {
    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void,

    rootGroup: Group,
    activeCollectionId: number | null,
    onSelectCollection: (collectionId: number) => void,

    onDragStartCollection: (collectionId: number, event: React.DragEvent) => void,
    onDragStartGroup: (groupId: number, event: React.DragEvent) => void,

    onDragOverCollection: (collectionId: number, event: React.DragEvent) => void,
    onDropOnCollection: (collectionId: number, event: React.DragEvent) => void,

    onDragOverGroup: (groupId: number, event: React.DragEvent) => void,
    onDropOnGroup: (groupId: number, event: React.DragEvent) => void,

    minimized: boolean,
    onSetMinimize: (mini: boolean) => void,

    onCreateCollection: () => void,
    onCreateGroup: () => void,

    onCollectionContextMenuRename: (collectionId: number) => void
    onCollectionContextMenuDelete: (collectionId: number) => void
    onCollectionContextMenuMove: (collectionId: number, targetGroupId: number | null) => void

    onGroupContextMenuRename: (groupId: number) => void
    onGroupContextMenuDelete: (groupId: number) => void
    onGroupContextMenuCreateCollection: (triggerGroupId: number) => void
    onGroupContextMenuCreateGroup: (triggerGroupId: number) => void
    onGroupContextMenuMove: (groupId: number, targetGroupId: number | null) => void

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

            <SidebarMenuSection title='Collections' actionButton={
                <CollectionSectionAction onCreateCollection={props.onCreateCollection} onCreateGroup={props.onCreateGroup} />
            }>
                {props.rootGroup && renderItems(props.rootGroup.collections, props.rootGroup.children)}
            </SidebarMenuSection>

            <CollectionContextMenu
                rootGroup={props.rootGroup}
                onActionRename={props.onCollectionContextMenuRename}
                onActionDelete={props.onCollectionContextMenuDelete}
                onActionMove={props.onCollectionContextMenuMove}
            />

            <GroupContextMenu
                rootGroup={props.rootGroup}
                onActionRename={props.onGroupContextMenuRename}
                onActionDelete={props.onGroupContextMenuDelete}
                onActionCreateCollection={props.onGroupContextMenuCreateCollection}
                onActionCreateGroup={props.onGroupContextMenuCreateGroup}
                onActionMove={props.onGroupContextMenuMove}
            />

        </SidebarMenu>
    );

    function renderItems(collections: Collection[], groups: Group[]): ReactElement[] {
        return [
            ...collections
                .sort((a: Collection, b: Collection) => {
                    const nameA: string = a.name.toUpperCase();
                    const nameB: string = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                })
                .map((collection: Collection) => {
                    return <CollectionEntry collection={collection}
                                            key={"collection-" + (collection.id ? collection.id : -1)}
                                            selectedId={props.activeCollectionId}
                                            onSelect={props.onSelectCollection}
                                            onDragStart={(event: React.DragEvent) => props.onDragStartCollection(collection.id, event)}
                                            onDragOver={(event: React.DragEvent) => props.onDragOverCollection(collection.id, event)}
                                            onDrop={(event: React.DragEvent) => props.onDropOnCollection(collection.id, event)} />;
                }),
            ...groups
                .sort((a: Group, b: Group) => {
                    const nameA: string = a.name.toUpperCase();
                    const nameB: string = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                })
                .map((child: Group) => renderGroup(child)),
        ];
    }

    function renderGroup(group: Group): React.ReactElement {
        return (
            <GroupEntry group={group}
                        onDragStart={(event: React.DragEvent) => props.onDragStartGroup(group.id, event)}
                        onDragOver={(event: React.DragEvent) => props.onDragOverGroup(group.id, event)}
                        onDrop={(event: React.DragEvent) => props.onDropOnGroup(group.id, event)}
                        key={"group-" + group.id}>
                {renderItems(group.collections, group.children)}
            </GroupEntry>
        );
    }
}


