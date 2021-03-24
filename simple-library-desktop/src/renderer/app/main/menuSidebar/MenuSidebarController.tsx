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
import { DialogCreateCollectionController } from './DialogCreateCollection';
import { DialogRenameCollectionController } from './DialogRenameCollection';
import { DragAndDropCollections, DragAndDropItems } from '../../common/dragAndDrop';
import { DialogCreateGroupController } from './DialogCreateGroup';
import { DialogDeleteGroupController } from './DialogDeleteGroup';
import { DialogRenameGroupController } from './DialogRenameGroup';
import { DialogDeleteCollectionController } from './DialogDeleteCollection';
import { MoveCollectionMessage } from '../../../../common/messaging/messagesCollections';
import { MoveGroupMessage } from '../../../../common/messaging/messagesGroups';

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

        this.handleDragStartCollection = this.handleDragStartCollection.bind(this)
        this.handleDragOverGroup = this.handleDragOverGroup.bind(this);
        this.handleDropOnGroup = this.handleDropOnGroup.bind(this);

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

                    onDragStartCollection={this.handleDragStartCollection}
                    onDragOverGroup={this.handleDragOverGroup}
                    onDropOnGroup={this.handleDropOnGroup}

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

                {this.state.showImportDialog && (  // todo
                    <DialogImportFiles
                        onClose={this.handleOnCloseImport}
                        onImport={this.handleOnDoImport} />
                )}

                <DialogCreateCollectionController
                    show={this.state.showCreateCollectionDialog}
                    rootGroup={this.props.rootGroup}
                    triggerGroupId={this.state.triggerGroupId}
                    onClose={this.handleCloseCreateCollectionDialog}
                />

                <DialogDeleteCollectionController
                    show={this.state.showDialogDeleteCollection}
                    collection={this.state.collectionToDelete}
                    onClose={this.handleCloseDeleteCollectionDialog}
                />

                <DialogRenameCollectionController
                    show={this.state.showDialogRenameCollection}
                    collection={this.state.collectionToRename}
                    onClose={this.handleCloseRenameCollectionDialog}
                />

                <DialogCreateGroupController
                    show={this.state.showCreateGroupDialog}
                    rootGroup={this.props.rootGroup}
                    triggerGroupId={this.state.triggerGroupId}
                    onClose={this.handleCloseCreateGroupDialog}
                />

                <DialogDeleteGroupController
                    show={this.state.showDialogDeleteGroup}
                    group={this.findGroupById(this.state.triggerGroupId)}
                    onClose={this.handleCloseDeleteGroupDialog}
                />

                <DialogRenameGroupController
                    show={this.state.showDialogRenameGroup}
                    group={this.findGroupById(this.state.triggerGroupId)}
                    onClose={this.handleCloseRenameGroupDialog}
                />
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

    findCollectionById(collectionId: number | undefined): Collection | undefined {
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
    //  COLLECTION DRAG-N-DROP //
    //=========================//

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
    //    GROUP DRAG-N-DROP    //
    //=========================//

    handleDragStartCollection(collectionId: number, event: React.DragEvent) {
        DragAndDropCollections.setDragData(event.dataTransfer, collectionId);
    }

    handleDragOverGroup(groupId: number, event: React.DragEvent): void {
        DragAndDropCollections.setDropEffect(event.dataTransfer)
    }

    handleDropOnGroup(groupId: number, event: React.DragEvent): void {
        const dropData: DragAndDropCollections.Data = DragAndDropCollections.getDragData(event.dataTransfer);
        this.handleMoveCollection(dropData.collectionId, groupId);
    }

}
