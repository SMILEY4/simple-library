import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { Dir, Fill, Type } from '../../components/common';
import { Box } from '../../components/layout/Box';
import {
    CloseCurrentLibraryMessage,
    GetCollectionsMessage,
    GetItemsMessage,
    GetLibraryMetadataMessage,
    ImportFilesMessage,
    ImportStatusUpdateCommand,
} from '../../../main/messaging/messagesLibrary';
import { Response } from '../../../main/messaging/messages';
import { DialogImportFiles } from './import/DialogImportFiles';
import { Collection, ImportProcessData, ImportResult, ImportStatus } from '../../../common/commonModels';
import { NotificationEntry } from '../../components/notification/NotificationStack';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';
import { Grid } from '../../components/layout/Grid';
import { SidebarMenu } from '../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../components/sidebarmenu/SidebarMenuSection';
import { SidebarMenuItem } from '../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImages, BiImport, HiOutlineRefresh } from 'react-icons/all';

const { ipcRenderer } = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

interface Item {
    filepath: string,
    timestamp: number,
    hash: string,
    thumbnail: string,
    collection: string
}

interface MainViewState {
    name: string,
    timestampCreated: string,
    timestampLastOpened: string
    showImportFilesDialog: boolean
    collections: Collection[]
    items: Item[],
    currentCollectionId: number | undefined,
    sidebarMinimized: boolean
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
            name: '?',
            timestampCreated: '?',
            timestampLastOpened: '?',
            showImportFilesDialog: false,
            collections: [],
            items: [],
            currentCollectionId: undefined,
            sidebarMinimized: false,
        };
        this.closeLibrary = this.closeLibrary.bind(this);
        this.importFiles = this.importFiles.bind(this);
        this.updateItemList = this.updateItemList.bind(this);
    }

    componentDidMount() {
        GetLibraryMetadataMessage.request(ipcRenderer)
            .then(response => {
                this.setState({
                    name: response.body.name,
                    timestampCreated: response.body.timestampCreated,
                    timestampLastOpened: response.body.timestampLastOpened,
                });
            })
            .catch(error => {
                this.setState({
                    name: 'ERROR: ' + error,
                    timestampCreated: 'ERROR: ' + error,
                    timestampLastOpened: 'ERROR: ' + error,
                });
            });
        GetCollectionsMessage.request(ipcRenderer, true)
            .then(response => {
                this.setState({
                    collections: response.body,
                });
            })
            .catch(error => console.log("Error fetching collections."))
            .finally(() => this.updateItemList(this.state.currentCollectionId));
    }

    closeLibrary() {
        CloseCurrentLibraryMessage.request(ipcRenderer)
            .then(() => this.props.onCloseProject());
    }

    importFiles(data: ImportProcessData) {
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
            });
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>

                <Grid columns={[(this.state.sidebarMinimized ? "var(--s-3)" : 'var(--s-12)'), '1fr']}
                      rows={['100vh']}
                      fill={Fill.TRUE}
                      style={{
                          maxHeight: "100vh",
                      }}>

                    <SidebarMenu fillHeight
                                 minimizable={true}
                                 minimized={this.state.sidebarMinimized}
                                 onToggleMinimized={(mini: boolean) => this.setState({ sidebarMinimized: mini })}>

                        <SidebarMenuSection title='Actions'>
                            <SidebarMenuItem title={"Import"} icon={
                                <BiImport />} onClick={() => this.setState({ showImportFilesDialog: true })} />
                            <SidebarMenuItem title={"Refresh"} icon={
                                <HiOutlineRefresh />} onClick={() => this.updateItemList(this.state.currentCollectionId)} />
                            <SidebarMenuItem title={"Close"} icon={
                                <AiOutlineCloseCircle />} onClick={this.closeLibrary} />
                        </SidebarMenuSection>

                        <SidebarMenuSection title='Collections'>
                            <SidebarMenuItem title={"All Items"}
                                             icon={<BiImages />}
                                             selected={this.state.currentCollectionId === undefined}
                                             onClick={() => {
                                                 this.setState({ currentCollectionId: undefined });
                                                 this.updateItemList(undefined);
                                             }} />
                            {
                                this.state.collections.map((c: Collection) => {
                                    return (
                                        <SidebarMenuItem title={c.name}
                                                         label={""+c.itemCount}
                                                         icon={<BiImages />}
                                                         selected={this.state.currentCollectionId === c.id}
                                                         onClick={() => {
                                                             this.setState({ currentCollectionId: c.id });
                                                             this.updateItemList(c.id);
                                                         }} />
                                    );
                                })
                            }
                        </SidebarMenuSection>

                    </SidebarMenu>

                    <div style={{
                        maxHeight: "100vh",
                        overflow: "auto",
                    }}>
                        <table>
                            <tbody>
                            {
                                this.state.items.map(item => {
                                    return (
                                        <tr>
                                            <td style={{ border: "1px solid black" }}>
                                                <img src={item.thumbnail} alt='img' />
                                            </td>
                                            <td style={{ border: "1px solid black" }}>{item.filepath}</td>
                                            <td style={{ border: "1px solid black" }}>{item.collection}</td>
                                            <td style={{ border: "1px solid black" }}>{item.timestamp}</td>
                                            <td style={{ border: "1px solid black" }}>{item.hash}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                </Grid>


                <SFNotificationStack modalRootId='root'
                                     setAddSimpleFunction={(fun) => this.addNotification = fun}
                                     setRemoveFunction={(fun) => this.removeNotification = fun}
                                     setUpdateNotification={(fun) => this.updateNotification = fun}
                />

                {this.state.showImportFilesDialog && (
                    <DialogImportFiles
                        onClose={() => this.setState({ showImportFilesDialog: false })}
                        onImport={this.importFiles} />
                )}


            </Box>
        );
    }
}