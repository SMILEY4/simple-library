import * as React from 'react';
import { Component } from 'react';
import { MenuSidebar } from './MenuSidebar';
import {
    Collection,
    extractCollections,
    extractGroups,
    Group,
    ImportProcessData,
} from '../../../../common/commonModels';
import { DialogImportFiles } from '../import/DialogImportFiles';
import { DialogCreateCollection } from './DialogCreateCollection';
import { DialogDeleteCollection } from './DialogDeleteCollection';
import { DialogRenameCollection } from './DialogRenameCollection';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    RenameCollectionMessage,
} from '../../../../common/messaging/messagesCollections';
import { DragAndDropItems } from '../../common/dragAndDrop';
import { DialogCreateGroup } from './DialogCreateGroup';
import {
    CreateGroupMessage,
    DeleteGroupMessage,
    RenameGroupMessage,
} from '../../../../common/messaging/messagesGroups';
import { DialogDeleteGroup } from './DialogDeleteGroup';
import { DialogRenameGroup } from './DialogRenameGroup';

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
    showDialogRenameCollection: boolean,
    collectionToDelete: Collection | undefined
    collectionToRename: Collection | undefined

    showCreateGroupDialog: boolean,
    showDialogDeleteGroup: boolean,
    showDialogRenameGroup: boolean,
    groupToDelete: Group | undefined
    groupToRename: Group | undefined

}

export class MenuSidebarController extends Component<MenuSidebarControllerProps, MenuSidebarControllerState> {

    constructor(props: MenuSidebarControllerProps) {
        super(props);
        this.state = {
            minimized: false,
            showImportDialog: false,
            showCreateCollectionDialog: false,
            showDialogDeleteCollection: false,
            showDialogRenameCollection: false,
            collectionToDelete: undefined,
            collectionToRename: undefined,
            showCreateGroupDialog: false,
            showDialogDeleteGroup: false,
            showDialogRenameGroup: false,
            groupToDelete: undefined,
            groupToRename: undefined,
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

        this.handleCreateGroup = this.handleCreateGroup.bind(this);
        this.handleCreateGroupCancel = this.handleCreateGroupCancel.bind(this);
        this.handleCreateGroupAccept = this.handleCreateGroupAccept.bind(this);

        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleDeleteGroupCancel = this.handleDeleteGroupCancel.bind(this);
        this.handleDeleteGroupAccept = this.handleDeleteGroupAccept.bind(this);

        this.handleRenameGroup = this.handleRenameGroup.bind(this);
        this.handleRenameGroupCancel = this.handleRenameGroupCancel.bind(this);
        this.handleRenameGroupAccept = this.handleRenameGroupAccept.bind(this);

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
                    onCreateGroup={this.handleCreateGroup}

                    onCollectionContextMenuRename={this.handleRenameCollection}
                    onCollectionContextMenuDelete={this.handleDeleteCollection}

                    onGroupContextMenuRename={this.handleRenameGroup}
                    onGroupContextMenuDelete={this.handleDeleteGroup}
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
                {this.state.showCreateGroupDialog && (
                    <DialogCreateGroup
                        onClose={this.handleCreateGroupCancel}
                        onCreate={this.handleCreateGroupAccept}
                    />
                )}
                {this.state.showDialogDeleteGroup && (
                    <DialogDeleteGroup
                        groupName={this.state.groupToDelete ? this.state.groupToDelete.name : undefined}
                        onClose={this.handleDeleteGroupCancel}
                        onDelete={this.handleDeleteGroupAccept}
                    />
                )}
                {this.state.showDialogRenameGroup && (
                    <DialogRenameGroup
                        groupName={this.state.groupToRename ? this.state.groupToRename.name : undefined}
                        onClose={this.handleRenameGroupCancel}
                        onRename={this.handleRenameGroupAccept}
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
        DragAndDropItems.setDropEffect(event.dataTransfer, collectionId);
    }

    handleDropOnCollection(collectionId: number | undefined, event: React.DragEvent): void {
        const dropData: DragAndDropItems.Data = DragAndDropItems.getDragData(event.dataTransfer);
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
        CreateCollectionMessage.request(ipcRenderer, { name: collectionName })
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

    handleRenameCollectionAccept(newCollectionName: string): void {
        RenameCollectionMessage.request(ipcRenderer, {
            collectionId: this.state.collectionToRename.id,
            newName: newCollectionName,
        })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogRenameCollection: false,
                    collectionToRename: undefined,
                });
            });
    }

    handleCreateGroup(): void {
        this.setState({ showCreateGroupDialog: true });
    }

    handleCreateGroupCancel(): void {
        this.setState({ showCreateGroupDialog: false });
    }

    handleCreateGroupAccept(groupName: string): void {
        CreateGroupMessage.request(ipcRenderer, { name: groupName })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({ showCreateGroupDialog: false });
            });
    }

    handleDeleteGroup(groupId: number): void {
        this.setState({
            showDialogDeleteGroup: true,
            groupToDelete: extractGroups(this.props.rootGroup).find(g => g.id === groupId),
        });
    }

    handleDeleteGroupCancel(): void {
        this.setState({
            showDialogDeleteGroup: false,
            groupToDelete: undefined,
        });
    }

    handleDeleteGroupAccept(deleteChildren: boolean): void {
        DeleteGroupMessage.request(ipcRenderer, {
            groupId: this.state.groupToDelete.id,
            deleteChildren: deleteChildren,
        })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogDeleteGroup: false,
                    groupToDelete: undefined,
                });
            });
    }

    handleRenameGroup(groupId: number): void {
        this.setState({
            showDialogRenameGroup: true,
            groupToRename: extractGroups(this.props.rootGroup).find(g => g.id === groupId),
        });
    }

    handleRenameGroupCancel(): void {
        this.setState({
            showDialogRenameGroup: false,
            groupToRename: undefined,
        });
    }

    handleRenameGroupAccept(newGroupName: string): void {
        RenameGroupMessage.request(ipcRenderer, {
            groupId: this.state.groupToRename.id,
            newName: newGroupName,
        })
            .then(() => this.props.onCollectionsModified())
            .finally(() => {
                this.setState({
                    showDialogRenameGroup: false,
                    groupToRename: undefined,
                });
            });
    }

    setMinimized(minimized: boolean): void {
        this.setState({
            minimized: minimized,
        });
    }

}
