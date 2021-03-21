import * as React from 'react';
import { ReactElement } from 'react';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { Collection, Group } from '../../../../common/commonModels';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImages, BiImport, HiOutlineFolder, HiOutlineRefresh, HiPlus } from 'react-icons/all';
import { COLLECTION_CONTEXT_MENU_ID, CollectionContextMenu } from './CollectionContextMenu';
import { useContextMenu } from 'react-contexify';
import { SidebarMenuGroup } from "../../../components/sidebarmenu/SidebarMenuGroup";
import { DropdownButton } from '../../../components/button/dropdownbutton/DropdownButton';
import { Variant } from '../../../components/common';
import { DropdownItemType } from '../../../components/dropdown/Dropdown';
import { GROUP_CONTEXT_MENU_ID, GroupContextMenu } from './GroupContextMenu';


export interface MenuSidebarProps {
    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void,

    rootGroup: Group,
    activeCollectionId: number | undefined,
    onSelectCollection: (collectionId: number | undefined) => void,

    onDragOverCollection: (collectionId: number | undefined, event: React.DragEvent) => void,
    onDropOnCollection: (collectionId: number | undefined, event: React.DragEvent) => void,

    minimized: boolean,
    onSetMinimize: (mini: boolean) => void,

    onCreateCollection: () => void,
    onCreateGroup: () => void,

    onCollectionContextMenuRename: (collectionId: number) => void
    onCollectionContextMenuDelete: (collectionId: number) => void
    onCollectionContextMenuMove: (collectionId: number, targetGroupId: number | undefined) => void

    onGroupContextMenuRename: (groupId: number) => void
    onGroupContextMenuDelete: (groupId: number) => void
    onGroupContextMenuCreateCollection: (triggerGroupId: number) => void
    onGroupContextMenuCreateGroup: (triggerGroupId: number) => void
    onGroupContextMenuMove: (groupId: number, targetGroupId: number | undefined) => void

}

export function MenuSidebar(props: React.PropsWithChildren<MenuSidebarProps>): React.ReactElement {

    function renderItems(collections: Collection[], groups: Group[]): ReactElement[] {
        return [
            ...collections.map((collection: Collection) => {
                return <MenuCollection name={collection.name}
                                       id={collection.id}
                                       key={"collection-" + (collection.id ? collection.id : -1)}
                                       itemCount={collection.itemCount}
                                       selectedId={props.activeCollectionId}
                                       onSelect={props.onSelectCollection}
                                       onDragOver={(event: React.DragEvent) => props.onDragOverCollection(collection.id, event)}
                                       onDrop={(event: React.DragEvent) => props.onDropOnCollection(collection.id, event)} />;
            }),
            ...groups.map((child: Group) => renderGroup(child)),
        ];
    }

    function renderGroup(group: Group): React.ReactElement {
        return (
            <MenuGroup name={group.name} id={group.id} key={"group-" + group.id}>
                {renderItems(group.collections, group.children)}
            </MenuGroup>
        );
    }

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

interface CollectionSectionActionProps {
    onCreateCollection: () => void,
    onCreateGroup: () => void
}

function CollectionSectionAction(props: React.PropsWithChildren<CollectionSectionActionProps>) {
    return <DropdownButton icon={<HiPlus />} variant={Variant.GHOST} square items={[
        {
            type: DropdownItemType.ACTION,
            title: "New Collection",
            onAction: props.onCreateCollection,
        },
        {
            type: DropdownItemType.ACTION,
            title: "New Group",
            onAction: props.onCreateGroup,
        },
    ]} />;
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

interface MenuGroupProps {
    name: string,
    id: number
}

function MenuGroup(props: React.PropsWithChildren<MenuGroupProps>): React.ReactElement {

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
                          }}>
            {props.children}
        </SidebarMenuGroup>
    );
}
