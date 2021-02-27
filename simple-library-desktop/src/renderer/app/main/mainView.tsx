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
} from '../../../main/messaging/messagesLibrary';
import { Response } from '../../../main/messaging/messages';
import { Button } from '../../components/button/Button';
import { DialogImportFiles } from './import/DialogImportFiles';
import { ImportProcessData, ImportResult } from '../../../common/commonModels';
import { NotificationStack } from '../../components/notification/NotificationStack';

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
    notifications: NotificationEntry[]
}

interface NotificationEntry {
    title: string,
    text: string | ReactElement,
    type: Type,
    uid: string,
}

export class MainView extends Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            name: '?',
            timestampCreated: '?',
            timestampLastOpened: '?',
            showImportFilesDialog: false,
            items: [],
            notifications: [],
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
        console.log("IMPORT");
        console.log(JSON.stringify(data));
        ImportFilesMessage.request(ipcRenderer, data)
            .then((resp: Response) => {
                const importResult: ImportResult = resp.body;
                if (importResult.failed) {
                    this.addNotification(Type.ERROR, "Import failed", importResult.failureReason);
                } else if (importResult.encounteredErrors) {
                    const message: ReactElement = (
                        <ul>
                            {importResult.filesWithErrors.map((entry: ([string,string])) => <li>{entry[0] + ": " + entry[1]}</li>)}
                        </ul>
                    );
                    this.addNotification(Type.WARN, "Import encountered errors", message);
                } else {
                    this.addNotification(Type.SUCCESS, "Import successful", "Imported " + importResult.amountFiles + " files.");
                }
                this.updateItemList();
            })
            .catch(error => {
                this.addNotification(Type.ERROR, "Import failed unexpectedly", (error && error.body) ? error.body : JSON.stringify(error));
            });

    }

    addNotification(type: Type, title: string, text: string | ReactElement) {
        const notification: NotificationEntry = {
            title: title,
            text: text,
            type: type,
            uid: '' + Date.now(),
        };
        this.setState(prevState => ({
            notifications: [...prevState.notifications, notification],
        }));
    }

    removeNotification(uid: string) {
        this.setState(prevState => ({
            notifications: prevState.notifications.filter(e => e.uid !== uid),
        }));
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

                <NotificationStack
                    modalRootId='root'
                    notifications={
                        this.state.notifications.map(notification => ({
                            type: notification.type,
                            title: notification.title,
                            content: notification.text,
                            withCloseButton: true,
                            onClose: () => this.removeNotification(notification.uid),
                        }))
                    } />

                {this.state.showImportFilesDialog && (
                    <DialogImportFiles
                        onClose={() => this.setState({ showImportFilesDialog: false })}
                        onImport={this.importFiles} />
                )}


            </Box>
        );
    }
}