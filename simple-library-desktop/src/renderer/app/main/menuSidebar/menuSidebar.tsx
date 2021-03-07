import * as React from 'react';
import { Component } from 'react';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { Collection } from '../../../../common/commonModels';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { MenuActionClose, MenuActionImport, MenuActionRefresh, MenuCollection } from './menuSidebarItems';
import { ITEM_COPY_DRAG_GHOST_CLASS, ITEM_DRAG_GHOST_ID } from '../itemPanel/itemPanel';

export interface MenuSidebarProps {
    collections: Collection[]
    currentCollectionId: number | undefined,
    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void
    onActionSelectCollection: (id: number | undefined) => void
    onActionMoveItems: (sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean) => void
}

export interface MenuSidebarState {
    minimized: boolean
}

export class MenuSidebar extends Component<MenuSidebarProps, MenuSidebarState> {

    constructor(props: MenuSidebarProps) {
        super(props);
        this.state = {
            minimized: false,
        };
        this.setMinimizeState = this.setMinimizeState.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    setMinimizeState(minimized: boolean) {
        this.setState({
            minimized: minimized,
        });
    }

    handleDragOver(targetCollection: Collection, event: React.DragEvent) {
        let dragElement: any = document.getElementById(ITEM_DRAG_GHOST_ID);
        let mode: string;
        if (dragElement && dragElement.className.includes(ITEM_COPY_DRAG_GHOST_CLASS)) {
            mode = "copy";
        } else {
            mode = "move";
        }
        event.dataTransfer.dropEffect = mode;
    }

    handleDrop(targetCollection: Collection, dataTransfer: DataTransfer, copyMode: boolean) {
        const dropData: any = JSON.parse(dataTransfer.getData("application/json"));
        const srcCollectionId: number = dropData.sourceCollectionId;
        const tgtCollectionId: number = targetCollection.id;
        if (srcCollectionId !== tgtCollectionId) {
            this.props.onActionMoveItems(srcCollectionId, tgtCollectionId, dropData.itemIds, copyMode);
        }
    }

    render() {
        return (
            <SidebarMenu fillHeight
                         minimizable={true}
                         minimized={this.state.minimized}
                         onToggleMinimized={this.setMinimizeState}
                         style={{ width: 'var(--s-12)' }}>

                <SidebarMenuSection title='Actions'>
                    <MenuActionImport onAction={this.props.onActionImport} />
                    <MenuActionRefresh onAction={this.props.onActionRefresh} />
                    <MenuActionClose onAction={this.props.onActionClose} />
                </SidebarMenuSection>

                <SidebarMenuSection title='Collections'>
                    {this.props.collections.map((c: Collection) => {
                        return <MenuCollection name={c.name}
                                               id={c.id}
                                               itemCount={c.itemCount}
                                               selectedId={this.props.currentCollectionId}
                                               onSelect={this.props.onActionSelectCollection}
                                               onDragOver={(event: React.DragEvent) => this.handleDragOver(c, event)}
                                               onDrop={(dt: DataTransfer, copyMode: boolean) => this.handleDrop(c, dt, copyMode)}
                        />;
                    })}
                </SidebarMenuSection>

            </SidebarMenu>
        );
    }

}
