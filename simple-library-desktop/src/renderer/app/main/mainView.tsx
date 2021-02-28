import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { BodyText, H3Text } from '../../components/text/Text';
import { Dir, Type, Variant } from '../../components/common';
import { Box } from '../../components/layout/Box';
import {
    CloseCurrentLibraryMessage,
    GetItemsMessage,
    GetLibraryMetadataMessage,
    ImportFilesMessage,
    ImportStatusUpdateCommand,
} from '../../../main/messaging/messagesLibrary';
import { Response } from '../../../main/messaging/messages';
import { Button } from '../../components/button/Button';
import { DialogImportFiles } from './import/DialogImportFiles';
import { ImportProcessData, ImportResult, ImportStatus } from '../../../common/commonModels';
import { NotificationEntry } from '../../components/notification/NotificationStack';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';

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
    thumbnail: string
}

interface MainViewState {
    name: string,
    timestampCreated: string,
    timestampLastOpened: string
    showImportFilesDialog: boolean
    items: Item[],
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
            items: [],
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
        GetItemsMessage.request(ipcRenderer)
            .then(response => response.body)
            .then(items => {
                this.setState({
                    items: items.map((item: any) => {
                        return {
                            filepath: item.filepath,
                            timestamp: item.timestamp,
                            hash: item.hash,
                            thumbnail: item.thumbnail,
                        };
                    }),
                });
            });
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
                this.updateItemList();
            })
            .catch(error => {
                this.addNotification(Type.ERROR, true, "Import failed unexpectedly", (error && error.body) ? error.body : JSON.stringify(error));
            });
    }

    updateItemList() {
        GetItemsMessage.request(ipcRenderer)
            .then(response => response.body)
            .then(items => {
                this.setState({
                    items: items.map((item: any) => {
                        return {
                            filepath: item.filepath,
                            timestamp: item.timestamp,
                            hash: item.hash,
                            thumbnail: item.thumbnail,
                        };
                    }),
                });
            });
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>
                <H3Text>Main Screen</H3Text>
                <BodyText>{'Name: ' + this.state.name}</BodyText>
                <BodyText>{'Created: ' + this.state.timestampCreated}</BodyText>
                <BodyText>{'Last Opened: ' + this.state.timestampLastOpened}</BodyText>
                <Button variant={Variant.SOLID} onAction={() => this.setState({ showImportFilesDialog: true })}>Import
                    Files</Button>
                <Button variant={Variant.SOLID} onAction={this.closeLibrary}>Close Library</Button>
                <Button variant={Variant.SOLID} onAction={() => {
                    GetItemsMessage.request(ipcRenderer)
                        .then(response => response.body)
                        .then(items => {
                            this.setState({
                                items: items.map((item: any) => {
                                    return {
                                        filepath: item.filepath,
                                        timestamp: item.timestamp,
                                        hash: item.hash,
                                        thumbnail: item.thumbnail,
                                    };
                                }),
                            });
                        });
                }}>Refresh</Button>

                <div style={{ overflow: 'scroll' }}>
                    <table>
                        <tbody>
                        {
                            this.state.items.map(item => {
                                return (
                                    <tr>
                                        <td style={{ border: "1px solid black" }}><img src={item.thumbnail} alt='img' />
                                        </td>
                                        <td style={{ border: "1px solid black" }}>{item.filepath}</td>
                                        <td style={{ border: "1px solid black" }}>{item.timestamp}</td>
                                        <td style={{ border: "1px solid black" }}>{item.hash}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                </div>


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