import * as React from 'react';
import { Component, ReactElement } from 'react';
import './welcome.css';
import { Theme } from '../application';
import { requestCreateLibrary, requestLastOpened, requestOpenLibrary } from '../../../main/messaging/messages';
import { CaptionText, H1Text, H3Text } from '../../components/text/Text';
import { ButtonFilled, ButtonText } from '../../components/buttons/Buttons';
import { AlignCross, AlignMain, Fill, HighlightType, Size } from '../../components/common';
import imgWelcome from './imgWelcome.jpg';
import { Image } from '../../components/image/Image';
import { Box, VBox } from '../../components/layout/Box';
import { Grid } from '../../components/layout/Grid';
import { CreateLibraryDialog } from './CreateLibraryDialog';
import { NotificationStack } from '../../components/modal/NotificationStack';

const electron = window.require('electron');
const { ipcRenderer } = window.require('electron');

interface WelcomeViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onLoadProject: () => void
}

interface WelcomeViewState {
    recentlyUsed: LibraryEntry[],
    showCreateLibraryDialog: boolean,
    notifications: NotificationEntry[]
}

type LibraryEntry = {
    name: string,
    url: string
}

interface NotificationEntry {
    title: string,
    text: string,
    type: HighlightType,
    uid: string,
}


export class WelcomeView extends Component<WelcomeViewProps, WelcomeViewState> {

    constructor(props: WelcomeViewProps) {
        super(props);
        this.state = {
            recentlyUsed: [],
            showCreateLibraryDialog: false,
            notifications: [],
        };
        this.onCreateNewLibrary = this.onCreateNewLibrary.bind(this);
        this.onCancelCreateNewLibrary = this.onCancelCreateNewLibrary.bind(this);
        this.onOpenLibrary = this.onOpenLibrary.bind(this);
        this.onOpenRecentlyUsed = this.onOpenRecentlyUsed.bind(this);
        this.openLibrary = this.openLibrary.bind(this);
        this.createNewLibrary = this.createNewLibrary.bind(this);
        this.addErrorNotification = this.addErrorNotification.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
    }

    componentDidMount() {
        requestLastOpened(ipcRenderer)
            .then(response => {
                this.setState({
                    recentlyUsed: response.body.map((entry: any) => ({
                        name: entry.name,
                        url: entry.path,
                    })),
                });
            });
    }


    onCreateNewLibrary(): void {
        this.setState({ showCreateLibraryDialog: true });
    }


    onCancelCreateNewLibrary(): void {
        this.setState({ showCreateLibraryDialog: false });
    }


    onOpenLibrary(): void {
        electron.remote.dialog
            .showOpenDialog({
                title: 'Select Library',
                buttonLabel: 'Open',
                properties: [
                    'openFile',
                ],
                filters: [
                    {
                        name: 'All',
                        extensions: ['*'],
                    },
                    {
                        name: 'Libraries',
                        extensions: ['db'],
                    },
                ],
            })
            .then((result: any) => {
                if (!result.canceled) {
                    this.openLibrary(result.filePaths[0]);
                }
            });
    }


    onOpenRecentlyUsed(entry: LibraryEntry): void {
        this.openLibrary(entry.url);
    }


    openLibrary(path: string) {
        requestOpenLibrary(ipcRenderer, path)
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addErrorNotification('Error while opening library "' + name + '"', (error && error.body) ? error.body : JSON.stringify(error));
            });
    }


    createNewLibrary(name: string, targetDir: string): void {
        this.setState({ showCreateLibraryDialog: false });
        requestCreateLibrary(ipcRenderer, targetDir, name)
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addErrorNotification('Error while creating new library "' + name + '"', (error && error.body) ? error.body : JSON.stringify(error));
            });
    }

    addErrorNotification(title: string, text: string) {
        const notification: NotificationEntry = {
            title: title,
            text: text,
            type: HighlightType.ERROR,
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

    render(): ReactElement {
        return (
            <Box fill={Fill.TRUE}>
                <Grid columns={['1fr', '2fr']} rows={['1fr']} fill={Fill.TRUE}>
                    <Image url={imgWelcome} />
                    <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.CENTER} spacing={Size.S_1_5}>
                        <VBox alignCross={AlignCross.CENTER}>
                            <H1Text>Welcome</H1Text>
                            <CaptionText>Simple Library - v0.1.0</CaptionText>
                        </VBox>
                        <VBox alignCross={AlignCross.CENTER} spacing={Size.S_0_5}>
                            <ButtonFilled onClick={this.onCreateNewLibrary}>Create New Library</ButtonFilled>
                            <ButtonFilled onClick={this.onOpenLibrary}>Open Library</ButtonFilled>
                        </VBox>
                        {this.state.recentlyUsed.length > 0 && (
                            <VBox alignCross={AlignCross.CENTER}>
                                <H3Text>Recently used:</H3Text>
                                {this.state.recentlyUsed.map(entry =>
                                    <ButtonText key={entry.url} onClick={() => this.onOpenRecentlyUsed(entry)}>{entry.name}</ButtonText>)}
                            </VBox>
                        )}
                    </VBox>
                </Grid>
                <CreateLibraryDialog
                    show={this.state.showCreateLibraryDialog}
                    onClose={this.onCancelCreateNewLibrary}
                    onCreate={this.createNewLibrary}
                />
                <NotificationStack modalRootId='root' notifications={
                    this.state.notifications.map(notification => ({
                        gradient: notification.type,
                        title: notification.title,
                        content: notification.text,
                        withCloseButton: true,
                        onClose: () => this.removeNotification(notification.uid),
                    }))
                } />
            </Box>
        );
    }
}