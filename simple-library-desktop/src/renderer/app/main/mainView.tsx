import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { BodyText, H3Text } from '../../components/text/Text';
import { Dir, Variant } from '../../components/common';
import { Box } from '../../components/layout/Box';
import {
    CloseCurrentLibraryMessage,
    GetItemsMessage,
    GetLibraryMetadataMessage,
    ImportFilesMessage,
} from '../../../main/messaging/messagesLibrary';
import { Button } from '../../components/button/Button';
import { DialogImportFiles, ImportFilesData } from './import/DialogImportFiles';

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
    items: Item[]
}


export class MainView extends Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            name: '?',
            timestampCreated: '?',
            timestampLastOpened: '?',
            showImportFilesDialog: false,
            items: [
                {
                    filepath: "C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\2019 Spanien - BestOf\\LRM_EXPORT_18422619432128_20190306_123156861.jpeg",
                    timestamp: 1613914187042,
                    hash: "830170b36adbc5c072daa0472c37f4fe",
                    thumbnail: "data:image/jpg;base64,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",
                },
                {
                    filepath: "C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\2019 Spanien - BestOf\\LRM_EXPORT_18427860136162_20190306_123202102.jpeg",
                    timestamp: 1613914187142,
                    hash: "55a4c54dcc593c2a9abdcb098e94d4e7",
                    thumbnail: "data:image/jpg;base64,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",
                },
            ],
        };
        this.closeLibrary = this.closeLibrary.bind(this);
        this.importFiles = this.importFiles.bind(this);
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

    importFiles(data: ImportFilesData) {
        this.setState({ showImportFilesDialog: false });
        console.log("IMPORT");
        console.log(JSON.stringify(data));
        ImportFilesMessage.request(ipcRenderer, data.selectionData.files)
            .then(() => console.log("FILES IMPORTED"))
            .catch(error => console.log("IMPORT FILES FAILED: " + (error && error.body) ? error.body : JSON.stringify(error)));
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>
                <H3Text>Main Screen</H3Text>
                <BodyText>{'Name: ' + this.state.name}</BodyText>
                <BodyText>{'Created: ' + this.state.timestampCreated}</BodyText>
                <BodyText>{'Last Opened: ' + this.state.timestampLastOpened}</BodyText>
                <Button variant={Variant.SOLID} onAction={() => this.setState({ showImportFilesDialog: true })}>Import Files</Button>
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

                <DialogImportFiles
                    show={this.state.showImportFilesDialog}
                    onClose={() => this.setState({ showImportFilesDialog: false })}
                    onImport={this.importFiles} />

            </Box>
        );
    }
}