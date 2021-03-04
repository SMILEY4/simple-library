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
} from '../../../main/messaging/messagesLibrary';
import { Response } from '../../../main/messaging/messages';
import { DialogImportFiles } from './import/DialogImportFiles';
import { Collection, ImportProcessData, ImportResult, ImportStatus } from '../../../common/commonModels';
import { NotificationEntry } from '../../components/notification/NotificationStack';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';
import { Grid } from '../../components/layout/Grid';
import { MenuSidebar } from './menuSidebar/menuSidebar';
import { ItemPanel } from './itemPanel/itemPanel';

const { ipcRenderer } = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

export interface Item {
    filepath: string,
    timestamp: number,
    hash: string,
    thumbnail: string,
    collection: string
}

interface MainViewState {
    showImportFilesDialog: boolean
    collections: Collection[]
    items: Item[],
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
        this.actionCloseLibrary = this.actionCloseLibrary.bind(this);
        this.actionImportFiles = this.actionImportFiles.bind(this);
    }

    componentDidMount() {
        this.updateCollections();
    }


    updateCollections() {
        GetCollectionsMessage.request(ipcRenderer, true)
            .then(responseCollections => {
                GetTotalItemCountMessage.request(ipcRenderer)
                    .then(responseCount => {
                        const collectionAllItems: Collection = {
                            id: undefined,
                            name: "All Items",
                            itemCount: responseCount.body,
                        };
                        const collections: Collection[] = [collectionAllItems, ...responseCollections.body];
                        this.setState({ collections: collections });
                    })
                    .catch(() => console.error("Error fetching total item count"));
            })
            .catch(() => console.error("Error fetching collections."))
            .finally(() => this.updateItemList(this.state.currentCollectionId));
    }

    updateItemList(collectionId: number | undefined) {
        GetItemsMessage.request(ipcRenderer, collectionId)
            .then(response => response.body)
            .then(items => {
                this.setState({
                    items: items.map((item: any) => {
                        return {
                            filepath: item.filepath,
                            timestamp: item.timestamp,
                            hash: item.hash,
                            thumbnail: item.thumbnail,
                            collection: (
                                item.collectionIds
                                    ? item.collectionIds.map((id: number) => this.state.collections.find((c: Collection) => c.id === id).name).join(", ")
                                    : undefined
                            ),
                        };
                    }),
                });
            })
            .catch(() => console.error("Error updating item list"));
    }

    actionCloseLibrary() {
        CloseCurrentLibraryMessage.request(ipcRenderer)
            .then(() => this.props.onCloseProject());
    }

    actionImportFiles(data: ImportProcessData) {
        this.setState({ showImportFilesDialog: false });
        const uidStatusNotification: string = this.addNotification(Type.PRIMARY, false, "Importing", "");
        ImportStatusUpdateCommand.on(ipcRenderer, (status: ImportStatus) => {
            this.updateNotification(uidStatusNotification, (entry: NotificationEntry) => {
                entry.content = status.completedFiles + "/" + status.totalAmountFiles + " files imported.";
                return entry;
            });
        });
        ImportFilesMessage.request(ipcRenderer, data)
            .then((resp: Response) => {
                const importResult: ImportResult = resp.body;
                if (importResult.failed) {
                    this.addNotification(Type.ERROR, true, "Import failed", importResult.failureReason);
                } else if (importResult.encounteredErrors) {
                    const message: ReactElement = (
                        <ul>
                            {importResult.filesWithErrors.map((entry: ([string, string])) =>
                                <li>{entry[0] + ": " + entry[1]}</li>)}
                        </ul>
                    );
                    this.addNotification(Type.WARN, true, "Import encountered errors", message);
                } else {
                    this.addNotification(Type.SUCCESS, true, "Import successful", "Imported " + importResult.amountFiles + " files.");
                }
                this.removeNotification(uidStatusNotification);
                this.updateItemList(this.state.currentCollectionId);
            })
            .catch(error => {
                this.addNotification(Type.ERROR, true, "Import failed unexpectedly", (error && error.body) ? error.body : JSON.stringify(error));
            });
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>

                <Grid columns={['auto', '1fr']}
                      rows={['100vh']}
                      fill={Fill.TRUE}
                      style={{ maxHeight: "100vh" }}>
                    <MenuSidebar
                        collections={this.state.collections}
                        currentCollectionId={this.state.currentCollectionId}
                        onActionImport={() => this.setState({ showImportFilesDialog: true })}
                        onActionRefresh={() => this.updateItemList(this.state.currentCollectionId)}
                        onActionClose={this.actionCloseLibrary}
                        onActionSelectCollection={(id: number | undefined) => {
                            this.setState({ currentCollectionId: id });
                            this.updateItemList(id);
                        }}
                    />
                    <ItemPanel selectedCollectionId={this.state.currentCollectionId} items={this.state.items} />
                </Grid>

                <SFNotificationStack modalRootId='root'
                                     setAddSimpleFunction={(fun) => this.addNotification = fun}
                                     setRemoveFunction={(fun) => this.removeNotification = fun}
                                     setUpdateNotification={(fun) => this.updateNotification = fun}
                />

                {this.state.showImportFilesDialog && (
                    <DialogImportFiles
                        onClose={() => this.setState({ showImportFilesDialog: false })}
                        onImport={this.actionImportFiles} />
                )}

            </Box>
        );
    }
}