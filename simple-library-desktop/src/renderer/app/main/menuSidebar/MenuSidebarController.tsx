import * as React from 'react';
import { Component } from 'react';
import { MenuSidebar } from './MenuSidebar';
import {Collection, extractCollections, Group, ImportProcessData} from '../../../../common/commonModels';
import { ITEM_COPY_DRAG_GHOST_CLASS, ITEM_DRAG_GHOST_ID } from '../itemPanel/ItemPanelController';
import { DialogImportFiles } from '../import/DialogImportFiles';
import { DialogCreateCollection } from './DialogCreateCollection';
import { DialogDeleteCollection } from './DialogDeleteCollection';
import { DialogRenameCollection } from './DialogRenameCollection';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    RenameCollectionMessage,
} from '../../../../common/messaging/messagesCollections';

const { ipcRenderer } = window.require('electron');


interface MenuSidebarControllerProps {
    rootGroup: Group,
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
    collectionToDelete: Collection | undefined

    showDialogRenameCollection: boolean,
    collectionToRename: Collection | undefined


}

export class MenuSidebarController extends Component<MenuSidebarControllerProps, MenuSidebarControllerState> {

    constructor(props: MenuSidebarControllerProps) {
        super(props);
        this.state = {
            minimized: false,
            showImportDialog: false,
            showCreateCollectionDialog: false,
            showDialogDeleteCollection: false,
            collectionToDelete: undefined,
            showDialogRenameCollection: false,
            collectionToRename: undefined,
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
        this.handleRenameCollection = this.handleRenameCollection.bind(this);
        this.handleRenameCollectionCancel = this.handleRenameCollectionCancel.bind(this);
        this.handleRenameCollectionAccept = this.handleRenameCollectionAccept.bind(this);
        this.setMinimized = this.setMinimized.bind(this);
    }

    render() {
        return (
            <>
                <MenuSidebar
                    onActionImport={this.handleOnStartImport}
                    onActionRefresh={this.props.onActionRefresh}
                    onActionClose={this.props.onActionClose}

                    rootGroup={this.props.rootGroup}
                    activeCollectionId={this.props.activeCollectionId}

                    onSelectCollection={this.props.onSelectCollection}
                    onDragOverCollection={this.handleDragOverCollection}
                    onDropOnCollection={this.handleDropOnCollection}

                    minimized={this.state.minimized}
                    onSetMinimize={this.setMinimized}

                    onCreateCollection={this.handleCreateCollection}
                    onContextMenuActionRename={this.handleRenameCollection}
                    onContextMenuActionDelete={this.handleDeleteCollection}

                />
                {this.state.showImportDialog && (
                    <DialogImportFiles
                        onClose={this.handleOnCloseImport}
                        onImport={this.handleOnDoImport} />
                )}
                {this.state.showCreateCollectionDialog && (
                    <DialogCreateCollection
                        onClose={this.handleCreateCollectionCancel}
                        onCreate={this.handleCreateCollectionAccept}
                    />
                )}
                {this.state.showDialogDeleteCollection && (
                    <DialogDeleteCollection
                        collectionName={this.state.collectionToDelete ? this.state.collectionToDelete.name : undefined}
                        onClose={this.handleDeleteCollectionCancel}
                        onDelete={this.handleDeleteCollectionAccept}
                    />
                )}
                {this.state.showDialogRenameCollection && (
                    <DialogRenameCollection
                        collectionName={this.state.collectionToRename ? this.state.collectionToRename.name : undefined}
                        onClose={this.handleRenameCollectionCancel}
                        onRename={this.handleRenameCollectionAccept}
                    />
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
        CreateCollectionMessage.request(ipcRenderer, { name:collectionName })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({ showCreateCollectionDialog: false });
            });
    }

    handleDeleteCollection(collectionId: number): void {
        this.setState({
            showDialogDeleteCollection: true,
            collectionToDelete: extractCollections(this.props.rootGroup).find(c => c.id === collectionId),
        });
    }

    handleDeleteCollectionCancel(): void {
        this.setState({
            showDialogDeleteCollection: false,
            collectionToDelete: undefined,
        });
    }

    handleDeleteCollectionAccept(): void {
        DeleteCollectionMessage.request(ipcRenderer, { collectionId: this.state.collectionToDelete.id })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogDeleteCollection: false,
                    collectionToDelete: undefined,
                });
            });
    }

    handleRenameCollection(collectionId: number): void {
        this.setState({
            showDialogRenameCollection: true,
            collectionToRename: extractCollections(this.props.rootGroup).find(c => c.id === collectionId),
        });
    }

    handleRenameCollectionCancel(): void {
        this.setState({
            showDialogRenameCollection: false,
            collectionToRename: undefined,
        });
    }

    handleRenameCollectionAccept(newCollectionName:string): void {
        RenameCollectionMessage.request(ipcRenderer, { collectionId: this.state.collectionToRename.id, newName: newCollectionName })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogRenameCollection: false,
                    collectionToRename: undefined,
                });
            });
    }

    setMinimized(minimized: boolean): void {
        this.setState({
            minimized: minimized,
        });
    }

}
