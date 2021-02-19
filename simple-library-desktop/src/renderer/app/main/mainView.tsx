import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { BodyText, H3Text } from '../../components/text/Text';
import { Dir, Variant } from '../../components/common';
import { Box } from '../../components/layout/Box';
import {
    CloseCurrentLibraryMessage,
    CreateLibraryMessage,
    GetLibraryMetadataMessage, ImportFilesMessage,
} from '../../../main/messaging/messagesLibrary';
import { Button } from '../../components/button/Button';
import { DialogImportFiles, ImportFilesData } from './import/DialogImportFiles';

const { ipcRenderer } = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onCloseProject: () => void
}

interface MainViewState {
    name: string,
    timestampCreated: string,
    timestampLastOpened: string

    showImportFilesDialog: boolean
}


export class MainView extends Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            name: '?',
            timestampCreated: '?',
            timestampLastOpened: '?',
            showImportFilesDialog: false,
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
    }

    closeLibrary() {
        CloseCurrentLibraryMessage.request(ipcRenderer)
            .then(() => this.props.onCloseProject());
    }

    importFiles(data: ImportFilesData) {
        this.setState({showImportFilesDialog: false})
        console.log("IMPORT")
        console.log(JSON.stringify(data))
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
                <Button variant={Variant.SOLID} onAction={()=> this.setState({showImportFilesDialog: true})}>Import Files</Button>
                <Button variant={Variant.SOLID} onAction={this.closeLibrary}>Close Library</Button>
                <DialogImportFiles
                    show={this.state.showImportFilesDialog}
                    onClose={()=> this.setState({showImportFilesDialog: false})}
                    onImport={this.importFiles} />
            </Box>
        );
    }
}