import * as React from 'react';
import { Component } from 'react';
import { MenuSidebar } from './MenuSidebar';
import { Collection, ImportProcessData } from '../../../../common/commonModels';
import { ITEM_COPY_DRAG_GHOST_CLASS, ITEM_DRAG_GHOST_ID } from '../itemPanel/ItemPanelController';
import { DialogImportFiles } from '../import/DialogImportFiles';
import { CreateCollectionMessage, DeleteCollectionMessage } from '../../../../main/messaging/messagesLibrary';

const { ipcRenderer } = window.require('electron');


interface MenuSidebarControllerProps {
    collections: Collection[],
    activeCollectionId: number | undefined,
    onSelectCollection: (collectionId: number | undefined) => void,
    onActionImport: (data: ImportProcessData) => void,
    onActionRefresh: () => void,
    onActionClose: () => void,
    onActionMoveItems: (srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]) => void,
    onActionCopyItems: (srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]) => void,
    onCollectionsModified: () => void,
}

interface MenuSidebarControllerState {
    minimized: boolean,
    showImportDialog: boolean
    showCreateCollectionDialog: boolean
    showDialogDeleteCollection: boolean,
    deleteCollection: Collection | undefined
}

export class MenuSidebarController extends Component<MenuSidebarControllerProps, MenuSidebarControllerState> {

    constructor(props: MenuSidebarControllerProps) {
        super(props);
        this.state = {
            minimized: false,
            showImportDialog: false,
            showCreateCollectionDialog: false,
            showDialogDeleteCollection: false,
            deleteCollection: undefined,
        };
        this.handleOnStartImport = this.handleOnStartImport.bind(this);
        this.handleOnCloseImport = this.handleOnCloseImport.bind(this);
        this.handleOnDoImport = this.handleOnDoImport.bind(this);
        this.handleDragOverCollection = this.handleDragOverCollection.bind(this);
        this.handleDropOnCollection = this.handleDropOnCollection.bind(this);
        this.handleCreateCollection = this.handleCreateCollection.bind(this);
        this.handleCreateCollectionAccept = this.handleCreateCollectionAccept.bind(this);
        this.handleCreateCollectionCancel = this.handleCreateCollectionCancel.bind(this);
        this.handleDeleteCollection = this.handleDeleteCollection.bind(this);
        this.handleDeleteCollectionCancel = this.handleDeleteCollectionCancel.bind(this);
        this.handleDeleteCollectionAccept = this.handleDeleteCollectionAccept.bind(this);
        this.setMinimized = this.setMinimized.bind(this);
    }

    render() {
        return (
            <>
                <MenuSidebar
                    onActionImport={this.handleOnStartImport}
                    onActionRefresh={this.props.onActionRefresh}
                    onActionClose={this.props.onActionClose}

                    collections={this.props.collections}
                    activeCollectionId={this.props.activeCollectionId}

                    onSelectCollection={this.props.onSelectCollection}
                    onDragOverCollection={this.handleDragOverCollection}
                    onDropOnCollection={this.handleDropOnCollection}

                    minimized={this.state.minimized}
                    onSetMinimize={this.setMinimized}

                    onContextMenuActionRename={() => {
                        // todo
                    }}

                    showDialogCreateCollection={this.state.showCreateCollectionDialog}
                    onCreateCollection={this.handleCreateCollection}
                    onCreateCollectionAccept={this.handleCreateCollectionAccept}
                    onCreateCollectionCancel={this.handleCreateCollectionCancel}

                    onContextMenuActionDelete={this.handleDeleteCollection}
                    showDialogDeleteCollection={this.state.showDialogDeleteCollection}
                    deleteCollectionName={this.state.deleteCollection ? this.state.deleteCollection.name : undefined}
                    onDeleteCollectionCancel={this.handleDeleteCollectionCancel}
                    onDeleteCollectionAccept={this.handleDeleteCollectionAccept}

                />
                {this.state.showImportDialog && (
                    <DialogImportFiles
                        onClose={this.handleOnCloseImport}
                        onImport={this.handleOnDoImport} />
                )}
            </>
        );
    }

    handleOnStartImport(): void {
        this.setState({ showImportDialog: true });
    }

    handleOnCloseImport(): void {
        this.setState({ showImportDialog: false });
    }

    handleOnDoImport(data: ImportProcessData): void {
        this.setState({ showImportDialog: false });
        this.props.onActionImport(data);
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

    handleCreateCollection(): void {
        this.setState({ showCreateCollectionDialog: true });
    }

    handleCreateCollectionCancel(): void {
        this.setState({ showCreateCollectionDialog: false });
    }

    handleCreateCollectionAccept(collectionName: string): void {
        CreateCollectionMessage.request(ipcRenderer, collectionName)
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({ showCreateCollectionDialog: false });
            });
    }

    handleDeleteCollection(collectionId: number): void {
        this.setState({
            showDialogDeleteCollection: true,
            deleteCollection: this.props.collections.find(c => c.id === collectionId),
        });
    }

    handleDeleteCollectionCancel(): void {
        this.setState({
            showDialogDeleteCollection: false,
            deleteCollection: undefined,
        });
    }

    handleDeleteCollectionAccept(): void {
        DeleteCollectionMessage.request(ipcRenderer, this.state.deleteCollection.id)
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogDeleteCollection: false,
                    deleteCollection: undefined,
                });
            });
    }

    setMinimized(minimized: boolean): void {
        this.setState({
            minimized: minimized,
        });
    }

}