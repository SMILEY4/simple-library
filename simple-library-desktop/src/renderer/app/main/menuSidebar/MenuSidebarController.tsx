import * as React from 'react';
import { Component } from 'react';
import { MenuSidebar } from './MenuSidebar';
import { Collection } from '../../../../common/commonModels';
import { ITEM_COPY_DRAG_GHOST_CLASS, ITEM_DRAG_GHOST_ID } from '../itemPanel/itemPanel';


interface MenuSidebarControllerProps {
    collections: Collection[],
    activeCollectionId: number | undefined,
    onSelectCollection: (collectionId: number | undefined) => void

    onActionImport: () => void,
    onActionRefresh: () => void,
    onActionClose: () => void

    onActionMoveItems: (srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]) => void;
    onActionCopyItems: (srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]) => void;
}

interface MenuSidebarControllerState {
    minimized: boolean
}

export class MenuSidebarController extends Component<MenuSidebarControllerProps, MenuSidebarControllerState> {

    constructor(props: MenuSidebarControllerProps) {
        super(props);
        this.state = {
            minimized: false,
        };
        this.handleDragOverCollection = this.handleDragOverCollection.bind(this);
        this.handleDropOnCollection = this.handleDropOnCollection.bind(this);
        this.setMinimized = this.setMinimized.bind(this);
    }

    handleDragOverCollection(collectionId: number | undefined, event: React.DragEvent): void {
        let dragElement: any = document.getElementById(ITEM_DRAG_GHOST_ID);
        let mode: string;
        if (dragElement && dragElement.className.includes(ITEM_COPY_DRAG_GHOST_CLASS)) {
            mode = "copy";
        } else {
            mode = "move";
        }
        event.dataTransfer.dropEffect = mode;
    }

    handleDropOnCollection(collectionId: number | undefined, event: React.DragEvent): void {
        const dropData: any = JSON.parse(event.dataTransfer.getData("application/json"));
        const srcCollectionId: number = dropData.sourceCollectionId;
        if (srcCollectionId !== collectionId) {
            if (event.ctrlKey) {
                this.props.onActionCopyItems(srcCollectionId, collectionId, dropData.itemIds);
            } else {
                this.props.onActionMoveItems(srcCollectionId, collectionId, dropData.itemIds);
            }
        }
    }

    setMinimized(minimized: boolean): void {
        this.setState({
            minimized: minimized,
        });
    }

    render() {
        return <MenuSidebar
            onActionImport={this.props.onActionImport}
            onActionRefresh={this.props.onActionRefresh}
            onActionClose={this.props.onActionClose}

            collections={this.props.collections}
            activeCollectionId={this.props.activeCollectionId}
            onSelectCollection={this.props.onSelectCollection}

            onDragOverCollection={this.handleDragOverCollection}
            onDropOnCollection={this.handleDropOnCollection}

            minimized={this.state.minimized}
            onSetMinimize={this.setMinimized}
        />;
    }
}