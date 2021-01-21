import * as React from 'react';
import { Component, ReactElement } from 'react';
import './welcome.css';
import { Theme } from '../application';
import { requestCreateLibrary } from '../../../main/messages';
import { CaptionText, H1Text, H3Text } from '../../components/text/Text';
import { ButtonFilled, ButtonText } from '../../components/buttons/Buttons';
import { AlignCross, AlignMain, Fill, Size } from '../../components/common';
import imgWelcome from './imgWelcome.jpg';
import { Image } from '../../components/image/Image';
import { Box, VBox } from '../../components/layout/Box';
import { Grid } from '../../components/layout/Grid';
import { CreateLibraryDialog } from './CreateLibraryDialog';

const { ipcRenderer } = window.require('electron');

interface WelcomeViewProps {
    theme: Theme,
    onChangeTheme: () => void,
    onLoadProject: () => void
}

interface WelcomeViewState {
    recentlyUsed: LibraryEntry[]
    showCreateLibraryDialog: boolean
}

type LibraryEntry = {
    name: string,
    url: string
}


export class WelcomeView extends Component<WelcomeViewProps, WelcomeViewState> {

    constructor(props: WelcomeViewProps) {
        super(props);
        this.state = {
            recentlyUsed: [
                {
                    name: 'Family Photos',
                    url: 'path/to/family/photo/library',
                },
                {
                    name: 'My Images',
                    url: 'path/to/my/library',
                },
            ],
            showCreateLibraryDialog: false,
        };
        this.onCreateNewLibrary = this.onCreateNewLibrary.bind(this);
        this.onCancelCreateNewLibrary = this.onCancelCreateNewLibrary.bind(this);
        this.onOpenLibrary = this.onOpenLibrary.bind(this);
        this.onOpenRecentlyUsed = this.onOpenRecentlyUsed.bind(this);
        this.createNewLibrary = this.createNewLibrary.bind(this);
    }


    onCreateNewLibrary(): void {
        this.setState({ showCreateLibraryDialog: true });
    }


    onCancelCreateNewLibrary(): void {
        this.setState({ showCreateLibraryDialog: false });
    }


    onOpenLibrary(): void {
        // todo
    }


    onOpenRecentlyUsed(entry: LibraryEntry): void {
        // todo
    }


    createNewLibrary(name: string, targetDir: string): void {
        this.setState({ showCreateLibraryDialog: false });
        requestCreateLibrary(ipcRenderer, targetDir, name).then(
            data => this.props.onLoadProject(),
            error => console.log('Failed to create library: ' + error.reason),
        );
    }


    render(): ReactElement {
        const recentlyUsed: LibraryEntry[] = this.state.recentlyUsed;
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
                        {recentlyUsed.length > 0 && (
                            <VBox alignCross={AlignCross.CENTER}>
                                <H3Text>Recently used:</H3Text>
                                {recentlyUsed.map(entry =>
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
            </Box>
        );
    }
}