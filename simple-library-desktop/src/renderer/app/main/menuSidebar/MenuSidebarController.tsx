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
import { DialogCreateCollectionController } from './dialogs/DialogCreateCollection';
import { DialogRenameCollectionController } from './dialogs/DialogRenameCollection';
import {
    DragAndDropCollections,
    DragAndDropGroups,
    DragAndDropItems,
    DragAndDropUtils,
} from '../../common/dragAndDrop';
import { DialogCreateGroupController } from './dialogs/DialogCreateGroup';
import { DialogDeleteGroupController } from './dialogs/DialogDeleteGroup';
import { DialogRenameGroupController } from './dialogs/DialogRenameGroup';
import { DialogDeleteCollectionController } from './dialogs/DialogDeleteCollection';
import { MoveCollectionMessage } from '../../../../common/messaging/messagesCollections';
import { MoveGroupMessage } from '../../../../common/messaging/messagesGroups';

const { ipcRenderer } = window.require('electron');


interface MenuSidebarControllerProps {
    rootGroup: Group,
    activeCollectionId: number | null,
    onSelectCollection: (collectionId: number | null) => void,
    onActionImport: (data: ImportProcessData) => void,
    onActionRefresh: () => void,
    onActionClose: () => void,
    onActionMoveItems: (srcCollectionId: number | null, tgtCollectionId: number | null, itemIds: number[]) => void,
    onActionCopyItems: (srcCollectionId: number | null, tgtCollectionId: number | null, itemIds: number[]) => void,
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
    triggerGroupId: number | undefined
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
            triggerGroupId: undefined,
        };
        this.handleOnStartImport = this.handleOnStartImport.bind(this);
        this.handleOnCloseImport = this.handleOnCloseImport.bind(this);
        this.handleOnDoImport = this.handleOnDoImport.bind(this);
        this.handleMoveCollection = this.handleMoveCollection.bind(this);
        this.handleMoveGroup = this.handleMoveGroup.bind(this);

        this.handleDragOverCollection = this.handleDragOverCollection.bind(this);
        this.handleDropOnCollection = this.handleDropOnCollection.bind(this);

        this.handleDragOverGroup = this.handleDragOverGroup.bind(this);
        this.handleDropOnGroup = this.handleDropOnGroup.bind(this);

        this.handleDragStartCollection = this.handleDragStartCollection.bind(this);
        this.handleDragStartGroup = this.handleDragStartGroup.bind(this);

        this.handleOpenCreateCollectionDialog = this.handleOpenCreateCollectionDialog.bind(this);
        this.handleCloseCreateCollectionDialog = this.handleCloseCreateCollectionDialog.bind(this);

        this.handleOpenDeleteCollectionDialog = this.handleOpenDeleteCollectionDialog.bind(this);
        this.handleCloseDeleteCollectionDialog = this.handleCloseDeleteCollectionDialog.bind(this);

        this.handleOpenRenameCollectionDialog = this.handleOpenRenameCollectionDialog.bind(this);
        this.handleCloseRenameCollectionDialog = this.handleCloseRenameCollectionDialog.bind(this);

        this.handleOpenCreateGroupDialog = this.handleOpenCreateGroupDialog.bind(this);
        this.handleCloseCreateGroupDialog = this.handleCloseCreateGroupDialog.bind(this);

        this.handleOpenDeleteGroupDialog = this.handleOpenDeleteGroupDialog.bind(this);
        this.handleCloseDeleteGroupDialog = this.handleCloseDeleteGroupDialog.bind(this);

        this.handleOpenRenameGroupDialog = this.handleOpenRenameGroupDialog.bind(this);
        this.handleCloseRenameGroupDialog = this.handleCloseRenameGroupDialog.bind(this);

        this.setMinimized = this.setMinimized.bind(this);

        this.findCollectionById = this.findCollectionById.bind(this);
        this.findGroupById = this.findGroupById.bind(this);
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

                    onDragOverGroup={this.handleDragOverGroup}
                    onDropOnGroup={this.handleDropOnGroup}

                    onDragStartCollection={this.handleDragStartCollection}
                    onDragStartGroup={this.handleDragStartGroup}

                    minimized={this.state.minimized}
                    onSetMinimize={this.setMinimized}

                    onCreateCollection={() => this.handleOpenCreateCollectionDialog(undefined)}
                    onCreateGroup={() => this.handleOpenCreateGroupDialog(undefined)}

                    onCollectionContextMenuRename={this.handleOpenRenameCollectionDialog}
                    onCollectionContextMenuDelete={this.handleOpenDeleteCollectionDialog}
                    onCollectionContextMenuMove={this.handleMoveCollection}

                    onGroupContextMenuRename={this.handleOpenRenameGroupDialog}
                    onGroupContextMenuDelete={this.handleOpenDeleteGroupDialog}
                    onGroupContextMenuCreateCollection={this.handleOpenCreateCollectionDialog}
                    onGroupContextMenuCreateGroup={this.handleOpenCreateGroupDialog}
                    onGroupContextMenuMove={this.handleMoveGroup}
                />

                {this.state.showImportDialog && (
                    <DialogImportFiles
                        onClose={this.handleOnCloseImport}
                        onImport={this.handleOnDoImport}
                    />
                )}

                {this.state.showCreateCollectionDialog && (
                    <DialogCreateCollectionController
                        rootGroup={this.props.rootGroup}
                        triggerGroupId={this.state.triggerGroupId}
                        onClose={this.handleCloseCreateCollectionDialog}
                    />
                )}

                {this.state.showDialogDeleteCollection && (
                    <DialogDeleteCollectionController
                        collection={this.state.collectionToDelete}
                        onClose={this.handleCloseDeleteCollectionDialog}
                    />
                )}

                {this.state.showDialogRenameCollection && (
                    <DialogRenameCollectionController
                        collection={this.state.collectionToRename}
                        onClose={this.handleCloseRenameCollectionDialog}
                    />
                )}

                {this.state.showCreateGroupDialog && (
                    <DialogCreateGroupController
                        rootGroup={this.props.rootGroup}
                        triggerGroupId={this.state.triggerGroupId}
                        onClose={this.handleCloseCreateGroupDialog}
                    />
                )}

                {this.state.showDialogDeleteGroup && (
                    <DialogDeleteGroupController
                        group={this.findGroupById(this.state.triggerGroupId)}
                        onClose={this.handleCloseDeleteGroupDialog}
                    />
                )}

                {this.state.showDialogRenameGroup && (
                    <DialogRenameGroupController
                        group={this.findGroupById(this.state.triggerGroupId)}
                        onClose={this.handleCloseRenameGroupDialog}
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

    setMinimized(minimized: boolean): void {
        this.setState({
            minimized: minimized,
        });
    }

    findCollectionById(collectionId: number | null): Collection | undefined {
        return extractCollections(this.props.rootGroup).find(c => c.id === collectionId);
    }

    findGroupById(groupId: number | undefined): Group | undefined {
        if (groupId) {
            return extractGroups(this.props.rootGroup).find(g => g.id === groupId);
        } else {
            return undefined;
        }
    }

    //=========================//
    //    CREATE COLLECTION    //
    //=========================//

    handleOpenCreateCollectionDialog(parentGroupId: number | undefined): void {
        this.setState({
            showCreateCollectionDialog: true,
            triggerGroupId: parentGroupId,
        });
    }

    handleCloseCreateCollectionDialog(successful: boolean): void {
        this.setState({
            showCreateCollectionDialog: false,
            triggerGroupId: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }

    //=========================//
    //    DELETE COLLECTION    //
    //=========================//

    handleOpenDeleteCollectionDialog(collectionId: number): void {
        this.setState({
            showDialogDeleteCollection: true,
            collectionToDelete: extractCollections(this.props.rootGroup).find(c => c.id === collectionId),
        });
    }

    handleCloseDeleteCollectionDialog(successful: boolean): void {
        this.setState({
            showDialogDeleteCollection: false,
            collectionToDelete: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }


    //=========================//
    //    RENAME COLLECTION    //
    //=========================//

    handleOpenRenameCollectionDialog(collectionId: number): void {
        this.setState({
            showDialogRenameCollection: true,
            collectionToRename: extractCollections(this.props.rootGroup).find(c => c.id === collectionId),
        });
    }

    handleCloseRenameCollectionDialog(successful: boolean): void {
        this.setState({
            showDialogRenameCollection: false,
            collectionToRename: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }

    //=========================//
    //     MOVE COLLECTION     //
    //=========================//

    handleMoveCollection(collectionId: number, targetGroupId: number | undefined): void {
        MoveCollectionMessage.request(ipcRenderer, {
            collectionId: collectionId,
            targetGroupId: targetGroupId,
        }).then(() => this.props.onCollectionsModified());
    }

    //=========================//
    //     DRAG COLLECTION     //
    //=========================//

    handleDragStartCollection(collectionId: number, event: React.DragEvent) {
        DragAndDropCollections.setDragData(event.dataTransfer, collectionId);
    }

    //=========================//
    //    DROP ON COLLECTION   //
    //=========================//

    handleDragOverCollection(collectionId: number | null, event: React.DragEvent): void {
        DragAndDropItems.setDropEffect(event.dataTransfer, collectionId);
    }

    handleDropOnCollection(collectionId: number | null, event: React.DragEvent): void {
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

    //=========================//
    //      CREATE GROUP       //
    //=========================//

    handleOpenCreateGroupDialog(parentGroupId: number | undefined): void {
        this.setState({
            showCreateGroupDialog: true,
            triggerGroupId: parentGroupId,
        });
    }

    handleCloseCreateGroupDialog(successful: boolean): void {
        this.setState({
            showCreateGroupDialog: false,
            triggerGroupId: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }

    //=========================//
    //      DELETE GROUP       //
    //=========================//

    handleOpenDeleteGroupDialog(groupId: number): void {
        this.setState({
            showDialogDeleteGroup: true,
            triggerGroupId: groupId,
        });
    }


    handleCloseDeleteGroupDialog(successful: boolean): void {
        this.setState({
            showDialogDeleteGroup: false,
            triggerGroupId: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }

    //=========================//
    //      RENAME GROUP       //
    //=========================//

    handleOpenRenameGroupDialog(groupId: number): void {
        this.setState({
            showDialogRenameGroup: true,
            triggerGroupId: groupId,
        });
    }

    handleCloseRenameGroupDialog(successful: boolean): void {
        this.setState({
            showDialogRenameGroup: false,
            triggerGroupId: undefined,
        });
        if (successful) {
            this.props.onCollectionsModified();
        }
    }

    //=========================//
    //        MOVE GROUP       //
    //=========================//

    handleMoveGroup(groupId: number, targetGroupId: number | undefined): void {
        MoveGroupMessage.request(ipcRenderer, {
            groupId: groupId,
            targetGroupId: targetGroupId,
        }).then(() => this.props.onCollectionsModified());
    }

    //=========================//
    //        DRAG GROUP       //
    //=========================//

    handleDragStartGroup(groupId: number, event: React.DragEvent): void {
        DragAndDropGroups.setDragData(event.dataTransfer, groupId);
    }

    //=========================//
    //      DROP ON GROUP      //
    //=========================//

    handleDragOverGroup(groupId: number, event: React.DragEvent): void {
        const dataTransfer: DataTransfer = event.dataTransfer;
        const metaMimeType: string | undefined = DragAndDropUtils.getMetadataMimeType(dataTransfer);
        DragAndDropUtils.setDropEffectForbidden(dataTransfer);
        if (metaMimeType === DragAndDropGroups.META_MIME_TYPE) {
            DragAndDropGroups.setDropEffect(dataTransfer, groupId, this.props.rootGroup);
        }
        if (metaMimeType === DragAndDropCollections.META_MIME_TYPE) {
            DragAndDropCollections.setDropEffect(dataTransfer);
        }
    }

    handleDropOnGroup(groupId: number, event: React.DragEvent): void {
        const dataTransfer: DataTransfer = event.dataTransfer;
        const metaMimeType: string | undefined = DragAndDropUtils.getMetadataMimeType(dataTransfer);
        if (metaMimeType === DragAndDropGroups.META_MIME_TYPE) {
            const dropData: DragAndDropGroups.Data = DragAndDropGroups.getDragData(dataTransfer);
            if (DragAndDropGroups.allowDrop(dropData.groupId, groupId, this.props.rootGroup)) {
                this.handleMoveGroup(dropData.groupId, groupId);
            }
        }
        if (metaMimeType === DragAndDropCollections.META_MIME_TYPE) {
            const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(dataTransfer);
            this.handleMoveCollection(dropData.collectionId, groupId);
        }
    }

}
