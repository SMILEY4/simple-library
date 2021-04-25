import * as React from 'react';
import { Component, ReactElement } from 'react';
import './welcome.css';
import { Theme } from '../../application';
import { Fill, Type } from '../../../components/common/common';
import imgWelcome from './imgWelcome.jpg';
import { Box } from '../../../components/layout/box/Box';
import { Grid } from '../../../components/_old/layout/Grid';
import { DialogCreateLibrary } from './DialogCreateLibrary';
import { Image } from '../../../components/_old/image/Image';
import { SFNotificationStack } from '../../../components/_old/notification/SFNotificationStack';
import { SidebarMenu } from '../../../components/_old/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/_old/sidebarmenu/SidebarMenuSection';
import { SidebarMenuItem } from '../../../components/_old/sidebarmenu/SidebarMenuItem';
import {
    CreateLibraryMessage,
    GetLastOpenedLibrariesMessage,
    OpenLibraryMessage,
} from '../../../../common/messaging/messagesLibrary';
import { LastOpenedLibraryEntry } from '../../../../common/commonModels';

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
                      title: string,
                      content: any) => string;

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
            .then((response: GetLastOpenedLibrariesMessage.ResponsePayload) => {
                this.setState({
                    recentlyUsed: response.lastOpened.map((entry: LastOpenedLibraryEntry) => ({
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
        OpenLibraryMessage.request(ipcRenderer, { path: path })
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addNotification(
                    Type.ERROR,
                    true,
                    'Error while opening library "' + name + '"',
                    (error && error.body) ? error.body : JSON.stringify(error),
                );
            });
    }


    createNewLibrary(name: string, targetDir: string): void {
        this.setState({ showCreateLibraryDialog: false });
        CreateLibraryMessage.request(ipcRenderer, { targetDir: targetDir, name: name })
            .then(() => this.props.onLoadProject())
            .catch(error => {
                this.addNotification(
                    Type.ERROR,
                    true,
                    'Error while creating new library "' + name + '"',
                    (error && error.body) ? error.body : JSON.stringify(error),
                );
            });
    }

    render(): ReactElement {
        return (
            <Box fill={Fill.TRUE}>

                <Grid columns={['var(--s-12)', '1fr']} rows={['1fr']} fill={Fill.TRUE}>
                    <SidebarMenu fillHeight minimized={false}>
                        <SidebarMenuSection title={"Actions"}>
                            <SidebarMenuItem title={"Create New Library"} onClick={this.onCreateNewLibrary} />
                            <SidebarMenuItem title={"Open Library"} onClick={this.onOpenLibrary} />
                        </SidebarMenuSection>
                        {this.state.recentlyUsed.length === 0 ? null : (
                            <SidebarMenuSection title={"Recently Used"}>
                                {
                                    this.state.recentlyUsed.map((entry: LibraryEntry) => {
                                        return <SidebarMenuItem title={entry.name} onClick={() => this.onOpenRecentlyUsed(entry)} />;
                                    })
                                }
                            </SidebarMenuSection>
                        )}
                    </SidebarMenu>
                    <Image url={imgWelcome} />
                </Grid>

                {this.state.showCreateLibraryDialog && (
                    <DialogCreateLibrary
                        onClose={this.onCancelCreateNewLibrary}
                        onCreate={this.createNewLibrary} />
                )}

                <SFNotificationStack modalRootId='root'
                                     setAddSimpleFunction={(fun) => this.addNotification = fun} />

            </Box>
        );
    }
}