import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import {
    CloseCurrentLibraryMessage,
    GetCollectionsMessage,
    GetItemsMessage,
    GetTotalItemCountMessage,
    ImportFilesMessage,
    ImportStatusUpdateCommand,
    MoveItemsToCollectionsMessage,
} from '../../../main/messaging/messagesLibrary';
import { Response } from '../../../main/messaging/messages';
import { Collection, ImportProcessData, ImportResult, ImportStatus, ItemData } from '../../../common/commonModels';
import { ItemPanelController } from './itemPanel/ItemPanelController';
import { MenuSidebarController } from './menuSidebar/MenuSidebarController';
import { MainView, MainViewMessageType } from './MainView';

const { ipcRenderer } = window.require('electron');

interface MainViewControllerProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

interface MainViewControllerState {
    showImportFilesDialog: boolean
    collections: Collection[]
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
            collections: [],
            items: [],
            currentCollectionId: undefined,
        };
        this.updateCollections = this.updateCollections.bind(this);
        this.updateItemList = this.updateItemList.bind(this);
        this.fetchCollections = this.fetchCollections.bind(this);
        this.fetchTotalItemCount = this.fetchTotalItemCount.bind(this);
        this.fetchItems = this.fetchItems.bind(this);
        this.actionCloseLibrary = this.actionCloseLibrary.bind(this);
        this.handleImportStatusUpdate = this.handleImportStatusUpdate.bind(this);
        this.handleImportFailed = this.handleImportFailed.bind(this);
        this.handleImportWithErrors = this.handleImportWithErrors.bind(this);
        this.handleImportSuccessful = this.handleImportSuccessful.bind(this);
        this.actionMoveItems = this.actionMoveItems.bind(this);
        this.handleOnSelectCollection = this.handleOnSelectCollection.bind(this);
        this.handleOnRefresh = this.handleOnRefresh.bind(this);
        this.handleActionMoveItems = this.handleActionMoveItems.bind(this);
        this.handleActionCopyItems = this.handleActionCopyItems.bind(this);
        this.handleImport = this.handleImport.bind(this);
    }

    componentDidMount() {
        this.updateCollections()
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
                    collections={this.state.collections}
                    activeCollectionId={this.state.currentCollectionId}
                    onSelectCollection={this.handleOnSelectCollection}
                    onActionImport={this.handleImport}
                    onActionRefresh={this.handleOnRefresh}
                    onActionClose={this.actionCloseLibrary}
                    onActionMoveItems={this.handleActionMoveItems}
                    onActionCopyItems={this.handleActionCopyItems}
                    onCollectionsModified={this.updateCollections}
                />
                <ItemPanelController
                    collections={this.state.collections}
                    selectedCollectionId={this.state.currentCollectionId}
                    items={this.state.items}
                    onActionMove={(targetCollectionId: number | undefined, itemIds: number[]) => this.actionMoveItems(this.state.currentCollectionId, targetCollectionId, itemIds, false)}
                    onActionCopy={(targetCollectionId: number | undefined, itemIds: number[]) => this.actionMoveItems(this.state.currentCollectionId, targetCollectionId, itemIds, true)}
                />
            </MainView>
        );
    }

    handleOnSelectCollection(collectionId: number): void {
        this.setState({ currentCollectionId: collectionId });
        this.updateItemList(collectionId);
    }

    actionCloseLibrary() {
        CloseCurrentLibraryMessage.request(ipcRenderer)
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
        MoveItemsToCollectionsMessage.request(ipcRenderer, sourceCollectionId, collectionId, itemIds, copyMode)
            .catch((error) => {
                this.showNotification(MainViewMessageType.MOVE_ITEMS_IN_COLLECTION_FAILED, error);
                return Promise.reject();
            })
            .then(() => this.updateCollections().then(() => this.updateItemList(this.state.currentCollectionId)));
    }

    updateCollections(): Promise<void> {
        return this.fetchCollections().then((collections: Collection[]) => {
            this.fetchTotalItemCount().then((itemCount: number) => {
                const collectionAllItems: Collection = {
                    id: undefined,
                    name: "All Items",
                    itemCount: itemCount,
                };
                this.setState({ collections: [collectionAllItems, ...collections] });
            });
        });
    }

    updateItemList(collectionId: number | undefined) {
        this.fetchItems(collectionId)
            .then(items => this.setState({ items: items }));
    }

    fetchCollections(): Promise<Collection[]> {
        return GetCollectionsMessage.request(ipcRenderer, true)
            .then((response: Response) => {
                return response.body;
            })
            .catch(error => {
                this.showNotification(MainViewMessageType.FETCH_COLLECTIONS_FAILED, error);
                return Promise.reject();
            });
    }

    fetchTotalItemCount(): Promise<number> {
        return GetTotalItemCountMessage.request(ipcRenderer)
            .then((response: Response) => {
                return response.body;
            })
            .catch(error => {
                this.showNotification(MainViewMessageType.FETCH_TOTAL_ITEM_COUNT_FAILED, error);
                return Promise.reject();
            });
    }

    fetchItems(collectionId: number | undefined): Promise<ItemData[]> {
        return GetItemsMessage.request(ipcRenderer, collectionId)
            .then((response: Response) => {
                return response.body;
            })
            .catch(error => {
                this.showNotification(MainViewMessageType.FETCH_ITEMS_FAILED, error);
                return Promise.reject();
            });
    }

    handleImport(data: ImportProcessData) {
        this.setState({ showImportFilesDialog: false });
        const uidStatusNotification: string = this.handleImportStatusUpdate();
        ImportFilesMessage.request(ipcRenderer, data)
            .then((resp: Response) => resp.body)
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
                this.updateCollections()
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