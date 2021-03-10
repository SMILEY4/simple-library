import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { Dir, Fill, Type } from '../../components/common';
import { Box } from '../../components/layout/Box';
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
import { DialogImportFiles } from './import/DialogImportFiles';
import { Collection, ImportProcessData, ImportResult, ImportStatus, ItemData } from '../../../common/commonModels';
import { NotificationEntry } from '../../components/notification/NotificationStack';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';
import { Grid } from '../../components/layout/Grid';
import { ItemPanelController } from './itemPanel/ItemPanelController';
import { MenuSidebarController } from './menuSidebar/MenuSidebarController';

const { ipcRenderer } = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

interface MainViewState {
    showImportFilesDialog: boolean
    collections: Collection[]
    items: ItemData[],
    currentCollectionId: number | undefined,
}

export class MainView extends Component<MainViewProps, MainViewState> {

    addNotification: (type: Type,
                      closable: boolean,
                      title: string,
                      content: any) => string;
    removeNotification: (uid: string) => void;
    updateNotification: (uid: string, action: (entry: NotificationEntry) => NotificationEntry) => void;

    constructor(props: MainViewProps) {
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
        this.actionImport = this.actionImport.bind(this);
        this.handleImportStatusUpdate = this.handleImportStatusUpdate.bind(this);
        this.handleImportFailed = this.handleImportFailed.bind(this);
        this.handleImportWithErrors = this.handleImportWithErrors.bind(this);
        this.handleImportSuccessful = this.handleImportSuccessful.bind(this);
        this.actionMoveItems = this.actionMoveItems.bind(this);
        this.displayErrorNotification = this.displayErrorNotification.bind(this);
        this.handleOnSelectCollection = this.handleOnSelectCollection.bind(this);
        this.handleOnImport = this.handleOnImport.bind(this);
        this.handleOnRefresh = this.handleOnRefresh.bind(this);
        this.handleActionMoveItems = this.handleActionMoveItems.bind(this);
        this.handleActionCopyItems = this.handleActionCopyItems.bind(this);
    }

    componentDidMount() {
        this.updateCollections()
            .then(() => this.updateItemList(this.state.currentCollectionId));
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
                this.displayErrorNotification("Unexpected error when fetching collections", error);
                return Promise.reject();
            });
    }

    fetchTotalItemCount(): Promise<number> {
        return GetTotalItemCountMessage.request(ipcRenderer)
            .then((response: Response) => {
                return response.body;
            })
            .catch(error => {
                this.displayErrorNotification("Unexpected error when fetching total item count", error);
                return Promise.reject();
            });
    }

    fetchItems(collectionId: number | undefined): Promise<ItemData[]> {
        return GetItemsMessage.request(ipcRenderer, collectionId)
            .then((response: Response) => {
                return response.body;
            })
            .catch(error => {
                this.displayErrorNotification("Unexpected error when fetching items", error);
                return Promise.reject();
            });
    }

    actionImport(data: ImportProcessData) {
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
                this.displayErrorNotification("Import failed unexpectedly", error);
            });
    }

    handleImportStatusUpdate(): string {
        const uidStatusNotification: string = this.addNotification(Type.PRIMARY, false, "Importing", "");
        ImportStatusUpdateCommand.on(ipcRenderer, (status: ImportStatus) => {
            this.updateNotification(uidStatusNotification, (entry: NotificationEntry) => {
                entry.content = status.completedFiles + "/" + status.totalAmountFiles + " files imported.";
                return entry;
            });
        });
        return uidStatusNotification;
    }

    handleImportFailed(importResult: ImportResult) {
        this.addNotification(Type.ERROR, true, "Import failed", importResult.failureReason);
    }

    handleImportWithErrors(importResult: ImportResult) {
        const message: ReactElement = (
            <ul>
                {importResult.filesWithErrors.map((entry: ([string, string])) =>
                    <li>{entry[0] + ": " + entry[1]}</li>)}
            </ul>
        );
        this.addNotification(Type.WARN, true, "Import encountered errors", message);
    }

    handleImportSuccessful(importResult: ImportResult) {
        this.addNotification(Type.SUCCESS, true, "Import successful", "Imported " + importResult.amountFiles + " files.");
    }

    actionMoveItems(sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean) {
        MoveItemsToCollectionsMessage.request(ipcRenderer, sourceCollectionId, collectionId, itemIds, copyMode)
            .catch((error) => {
                this.displayErrorNotification("Unexpected error while moving items to collection", error);
                return Promise.reject();
            })
            .then(() => this.updateCollections().then(() => this.updateItemList(this.state.currentCollectionId)));
    }

    actionCloseLibrary() {
        CloseCurrentLibraryMessage.request(ipcRenderer)
            .then(() => this.props.onCloseProject());
    }

    displayErrorNotification(title: string, error: any) {
        let errorString: string = String(error);
        if (errorString === "[object Object]") {
            errorString = JSON.stringify(error);
        }
        this.addNotification(Type.ERROR, true, title, errorString);
    }

    handleOnSelectCollection(collectionId: number): void {
        this.setState({ currentCollectionId: collectionId });
        this.updateItemList(collectionId);
    }

    handleOnImport(): void {
        this.setState({ showImportFilesDialog: true });
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

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>

                <Grid columns={['auto', '1fr']}
                      rows={['100vh']}
                      fill={Fill.TRUE}
                      style={{ maxHeight: "100vh" }}>
                    <MenuSidebarController
                        collections={this.state.collections}
                        activeCollectionId={this.state.currentCollectionId}
                        onSelectCollection={this.handleOnSelectCollection}
                        onActionImport={this.handleOnImport}
                        onActionRefresh={this.handleOnRefresh}
                        onActionClose={this.actionCloseLibrary}
                        onActionMoveItems={this.handleActionMoveItems}
                        onActionCopyItems={this.handleActionCopyItems}
                    />
                    <ItemPanelController
                        selectedCollectionId={this.state.currentCollectionId}
                        items={this.state.items}
                    />
                </Grid>

                <SFNotificationStack modalRootId='root'
                                     setAddSimpleFunction={(fun) => this.addNotification = fun}
                                     setRemoveFunction={(fun) => this.removeNotification = fun}
                                     setUpdateNotification={(fun) => this.updateNotification = fun}
                />

                {this.state.showImportFilesDialog && (
                    <DialogImportFiles
                        onClose={() => this.setState({ showImportFilesDialog: false })}
                        onImport={this.actionImport} />
                )}

            </Box>
        );
    }
}