import * as React from 'react';
import { Component, ReactElement } from 'react';
import './welcome.css';
import { Theme } from '../application';
import { AlignMain, Fill, Type } from '../../components/common';
import imgWelcome from './imgWelcome.jpg';
import { Box } from '../../components/layout/Box';
import { Grid } from '../../components/layout/Grid';
import {
    CreateLibraryMessage,
    GetLastOpenedLibrariesMessage,
    OpenLibraryMessage,
} from '../../../main/messaging/messagesLibrary';
import { SidebarElement, SidebarMenu } from '../../components/sidebarmenu/SidebarMenu';
import { DialogCreateLibrary } from './DialogCreateLibrary';
import { Image } from '../../components/image/Image';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';
import { NotificationEntry } from '../../components/notification/NotificationStack';

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
}

type LibraryEntry = {
    name: string,
    url: string
}


export class WelcomeView extends Component<WelcomeViewProps, WelcomeViewState> {

    addNotification: (type: Type,
                      closable: boolean,
                      icon: any,
                      title: string,
                      caption: string | undefined,
                      content: any) => string;
    removeNotification: (uid: string) => void;
    updateNotification: (uid: string, action: (entry: NotificationEntry) => NotificationEntry) => void;

    constructor(props: WelcomeViewProps) {
        super(props);
        this.state = {
            recentlyUsed: [],
            showCreateLibraryDialog: false,
        };
        this.onCreateNewLibrary = this.onCreateNewLibrary.bind(this);
        this.onCancelCreateNewLibrary = this.onCancelCreateNewLibrary.bind(this);
        this.onOpenLibrary = this.onOpenLibrary.bind(this);
        this.onOpenRecentlyUsed = this.onOpenRecentlyUsed.bind(this);
        this.openLibrary = this.openLibrary.bind(this);
        this.createNewLibrary = this.createNewLibrary.bind(this);
    }

    componentDidMount() {
        GetLastOpenedLibrariesMessage.request(ipcRenderer)
            .then(response => {
                this.setState({
                    recentlyUsed: response.body.map((entry: any) => ({
                        name: entry.name,
                        url: entry.path,
                    })),
                });
            });

        // const uid: string = this.addNotification(
        //     Type.PRIMARY,
        //     false,
        //     undefined,
        //     "Test Update Notification",
        //     "Created @" + Date.now(),
        //     "Test",
        // );
        //
        // setInterval(() => {
        //     this.updateNotification(uid, entry => {
        //         entry.content = entry.content + ".";
        //         return entry;
        //     });
        // }, 300);
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
                    {},
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
        OpenLibraryMessage.request(ipcRenderer, path)
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addNotification(
                    Type.ERROR,
                    true,
                    undefined,
                    'Error while opening library "' + name + '"',
                    undefined,
                    (error && error.body) ? error.body : JSON.stringify(error),
                );
            });
    }


    createNewLibrary(name: string, targetDir: string): void {
        this.setState({ showCreateLibraryDialog: false });
        CreateLibraryMessage.request(ipcRenderer, targetDir, name)
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addNotification(
                    Type.ERROR,
                    true,
                    undefined,
                    'Error while creating new library "' + name + '"',
                    undefined,
                    (error && error.body) ? error.body : JSON.stringify(error),
                );
            });
    }

    buildSidebarActions(recentlyUsed: any): SidebarElement[] {
        const elements: SidebarElement[] = [
            {
                typeID: "SECTION-TITLE",
                text: "Libraries",
            },
            {
                typeID: "ACTION",
                text: "Create New Library",
                onAction: this.onCreateNewLibrary,
            },
            {
                typeID: "ACTION",
                text: "Open Library",
                onAction: this.onOpenLibrary,
            },
        ];
        if (recentlyUsed.length > 0) {
            elements.push({
                typeID: "SECTION-TITLE",
                text: "Recently Used",
            });
        }
        recentlyUsed.forEach((entry: LibraryEntry) => {
            elements.push({
                typeID: "ACTION",
                text: entry.name,
                onAction: () => this.onOpenRecentlyUsed(entry),
            });
        });
        return elements;
    }

    render(): ReactElement {
        return (
            <Box fill={Fill.TRUE}>

                <Grid columns={['var(--s-12)', '1fr']} rows={['1fr']} fill={Fill.TRUE}>
                    <SidebarMenu align={AlignMain.CENTER} fillHeight elements={this.buildSidebarActions(this.state.recentlyUsed)} />
                    <Image url={imgWelcome} />
                </Grid>

                {this.state.showCreateLibraryDialog && (
                    <DialogCreateLibrary
                        onClose={this.onCancelCreateNewLibrary}
                        onCreate={this.createNewLibrary}
                    />
                )}

                <SFNotificationStack modalRootId='root'
                                     setAddFunction={(fun) => this.addNotification = fun}
                                     setRemoveFunction={(fun) => this.removeNotification = fun}
                                     setUpdateNotification={(fun) => this.updateNotification = fun}
                />

            </Box>
        );
    }
}