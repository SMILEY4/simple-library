import * as React from 'react';
import { SidebarMenuItem } from '../../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImages, BiImport, HiOutlineRefresh } from 'react-icons/all';


interface SimpleMenuActionProps {
    onAction: () => void,
}

export function MenuActionImport(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Import"}
        icon={<BiImport />}
        onClick={props.onAction}
    />;
}

export function MenuActionRefresh(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Refresh"}
        icon={<HiOutlineRefresh />}
        onClick={props.onAction}
    />;
}

export function MenuActionClose(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
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
    onDrop: (dataTransfer: DataTransfer, copyMode: boolean) => void
}

export function MenuCollection(props: React.PropsWithChildren<MenuCollectionProps>): React.ReactElement {
    return <SidebarMenuItem title={props.name}
                            icon={<BiImages />}
                            label={"" + props.itemCount}
                            selected={props.selectedId === props.id}
                            onClick={() => props.onSelect(props.id)}
                            enableDrop={true}
                            onDragOver={(event) => props.onDragOver(event)}
                            onDrop={(dt, event) => props.onDrop(dt, event.ctrlKey)} />;
}