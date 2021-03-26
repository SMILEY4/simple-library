import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { Group, ImportProcessData, ImportResult, ImportStatus, ItemData } from '../../../common/commonModels';
import { ItemPanelController } from './itemPanel/ItemPanelController';
import { MenuSidebarController } from './menuSidebar/MenuSidebarController';
import { MainView, MainViewMessageType } from './MainView';
import { CloseLibraryMessage } from '../../../common/messaging/messagesLibrary';
import {
    MoveItemsToCollectionsMessage,
    RemoveItemsFromCollectionsMessage,
} from '../../../common/messaging/messagesCollections';
import { GetGroupsMessage } from '../../../common/messaging/messagesGroups';
import {
    GetItemsMessage,
    ImportItemsMessage,
    ImportStatusUpdateCommand,
} from '../../../common/messaging/messagesItems';

const { ipcRenderer } = window.require('electron');

interface MainViewControllerProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

interface MainViewControllerState {
    showImportFilesDialog: boolean
    rootGroup: Group,
    items: ItemData[],
    currentCollectionId: number | undefined,
}

export class MainViewController extends Component<MainViewControllerProps, MainViewControllerState> {

    showNotification: (type: MainViewMessageType, data: any) => string;
    updateNotification: (notificationId: string, type: MainViewMessageType, data: any) => void;
    removeNotification: (notificationId: string) => void;

    constructor(props: MainViewControllerProps) {
        super(props);
        this.state = {
            showImportFilesDialog: false,
            rootGroup: undefined,
            items: [],
            currentCollectionId: undefined,
        };
        this.updateGroupsAndCollections = this.updateGroupsAndCollections.bind(this);
        this.updateItemList = this.updateItemList.bind(this);
        this.handleCloseLibrary = this.handleCloseLibrary.bind(this);
        this.handleImportStatusUpdate = this.handleImportStatusUpdate.bind(this);
        this.handleImportFailed = this.handleImportFailed.bind(this);
        this.handleImportWithErrors = this.handleImportWithErrors.bind(this);
        this.handleImportSuccessful = this.handleImportSuccessful.bind(this);
        this.actionMoveItems = this.actionMoveItems.bind(this);
        this.handleOnSelectCollection = this.handleOnSelectCollection.bind(this);
        this.handleOnRefresh = this.handleOnRefresh.bind(this);
        this.handleActionMoveItems = this.handleActionMoveItems.bind(this);
        this.handleActionCopyItems = this.handleActionCopyItems.bind(this);
        this.actionRemoveItems = this.actionRemoveItems.bind(this);
        this.handleImport = this.handleImport.bind(this);
    }

    componentDidMount() {
        this.updateGroupsAndCollections()
            .then(() => this.updateItemList(this.state.currentCollectionId));
    }

    render(): ReactElement {
        return (
            <MainView
                setShowNotification={(fun) => this.showNotification = fun}
                setUpdateNotification={(fun) => this.updateNotification = fun}
                setRemoveNotification={(fun) => this.removeNotification = fun}
            >
                <MenuSidebarController
                    rootGroup={this.state.rootGroup}
                    activeCollectionId={this.state.currentCollectionId}
                    onSelectCollection={this.handleOnSelectCollection}
                    onActionImport={this.handleImport}
                    onActionRefresh={this.handleOnRefresh}
                    onActionClose={this.handleCloseLibrary}
                    onActionMoveItems={this.handleActionMoveItems}
                    onActionCopyItems={this.handleActionCopyItems}
                    onCollectionsModified={this.updateGroupsAndCollections}
                />
                <ItemPanelController
                    rootGroup={this.state.rootGroup}
                    selectedCollectionId={this.state.currentCollectionId}
                    items={this.state.items}
                    onActionMove={(targetCollectionId: number | undefined, itemIds: number[]) => this.actionMoveItems(this.state.currentCollectionId, targetCollectionId, itemIds, false)}
                    onActionCopy={(targetCollectionId: number | undefined, itemIds: number[]) => this.actionMoveItems(this.state.currentCollectionId, targetCollectionId, itemIds, true)}
                    onActionRemove={(itemIds: number[]) => this.actionRemoveItems(this.state.currentCollectionId, itemIds)}
                />
            </MainView>
        );
    }

    handleOnSelectCollection(collectionId: number): void {
        this.setState({ currentCollectionId: collectionId });
        this.updateItemList(collectionId);
    }

    handleCloseLibrary() {
        CloseLibraryMessage.request(ipcRenderer)
            .then(() => this.props.onCloseProject());
    }

    handleOnRefresh(): void {
        this.updateItemList(this.state.currentCollectionId);
    }

    handleActionMoveItems(srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]): void {
        this.actionMoveItems(srcCollectionId, tgtCollectionId, itemIds, false);
    }

    handleActionCopyItems(srcCollectionId: number | undefined, tgtCollectionId: number | undefined, itemIds: number[]): void {
        this.actionMoveItems(srcCollectionId, tgtCollectionId, itemIds, true);
    }

    actionMoveItems(sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean) {
        MoveItemsToCollectionsMessage.request(ipcRenderer, {
            sourceCollectionId: sourceCollectionId,
            targetCollectionId: collectionId,
            itemIds: itemIds,
            copy: copyMode,
        })
            .catch((error) => {
                this.showNotification(MainViewMessageType.MOVE_ITEMS_IN_COLLECTION_FAILED, error);
                return Promise.reject();
            })
            .then(() => this.updateGroupsAndCollections().then(() => this.updateItemList(this.state.currentCollectionId)));
    }

    actionRemoveItems(sourceCollectionId: number, itemIds: number[]) {
        RemoveItemsFromCollectionsMessage.request(ipcRenderer, {
            collectionId: sourceCollectionId,
            itemIds: itemIds,
        })
            .catch((error) => {
                this.showNotification(MainViewMessageType.REMOVE_ITEMS_FROM_COLLECTION_FAILED, error);
                return Promise.reject();
            })
            .then(() => this.updateGroupsAndCollections().then(() => this.updateItemList(this.state.currentCollectionId)));
    }

    updateGroupsAndCollections(): Promise<void> {
        return GetGroupsMessage.request(ipcRenderer, { includeCollections: true, includeItemCount: true })
            .then((response: GetGroupsMessage.ResponsePayload) => response.groups[0])
            .then((rootGroup: Group) => this.setState({ rootGroup: rootGroup }))
            .catch(error => {
                this.showNotification(MainViewMessageType.FETCH_GROUPS_AND_COLLECTIONS_FAILED, error);
                return Promise.reject();
            });
    }

    updateItemList(collectionId: number | undefined) {
        return GetItemsMessage.request(ipcRenderer, { collectionId: collectionId })
            .then((response: GetItemsMessage.ResponsePayload) => response.items)
            .then((items: ItemData[]) => this.setState({ items: items }))
            .catch(error => {
                this.showNotification(MainViewMessageType.FETCH_ITEMS_FAILED, error);
                return Promise.reject();
            });
    }

    handleImport(data: ImportProcessData) {
        this.setState({ showImportFilesDialog: false });
        const uidStatusNotification: string = this.handleImportStatusUpdate();
        ImportItemsMessage.request(ipcRenderer, { data: data })
            .then((resp: ImportItemsMessage.ResponsePayload) => resp.result)
            .then((importResult: ImportResult) => {
                if (importResult.failed) {
                    this.handleImportFailed(importResult);
                } else if (importResult.encounteredErrors) {
                    this.handleImportWithErrors(importResult);
                } else {
                    this.handleImportSuccessful(importResult);
                }
            })
            .then(() => {
                this.removeNotification(uidStatusNotification);
                this.updateGroupsAndCollections()
                    .then(() => this.updateItemList(this.state.currentCollectionId));
            })
            .catch(error => {
                this.showNotification(MainViewMessageType.IMPORT_FAILED_UNKNOWN, error);
            });
    }

    handleImportStatusUpdate(): string {
        const uidStatusNotification: string = this.showNotification(MainViewMessageType.IMPORT_STATUS, undefined);
        ImportStatusUpdateCommand.on(ipcRenderer, (status: ImportStatus) => {
            this.updateNotification(uidStatusNotification, MainViewMessageType.IMPORT_STATUS, status);
        });
        return uidStatusNotification;
    }

    handleImportFailed(importResult: ImportResult) {
        this.showNotification(MainViewMessageType.IMPORT_FAILED, importResult);
    }

    handleImportWithErrors(importResult: ImportResult) {
        this.showNotification(MainViewMessageType.IMPORT_WITH_ERRORS, importResult);
    }

    handleImportSuccessful(importResult: ImportResult) {
        this.showNotification(MainViewMessageType.IMPORT_SUCCESSFUL, importResult);
    }

}
