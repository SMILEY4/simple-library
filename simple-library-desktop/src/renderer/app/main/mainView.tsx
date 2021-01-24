import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Theme } from '../application';
import { BodyText, H3Text } from '../../components/text/Text';
import { ButtonFilled } from '../../components/buttons/Buttons';
import { Dir } from '../../components/common';
import { requestLibraryMetadata, requestSwitchToWelcomeScreen } from '../../../main/messaging/messages';
import { Box } from '../../components/layout/Box';

const { ipcRenderer } = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void
}

interface MainViewState {
    name: string,
    timestampCreated: string,
    timestampLastOpened: string
}


export class MainView extends Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            name: '?',
            timestampCreated: '?',
            timestampLastOpened: '?',
        };
    }

    componentDidMount() {
        requestLibraryMetadata(ipcRenderer)
            .then(response => {
                this.setState({
                    name: response.body.name,
                    timestampCreated: response.body.timestampCreated,
                    timestampLastOpened: response.body.timestampLastOpened,
                });
            })
        .catch(error => {
            this.setState({
                name: "ERROR: " + error,
                timestampCreated: "ERROR: " + error,
                timestampLastOpened: "ERROR: " + error,
            });
        })
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>
                <H3Text>Main Screen</H3Text>
                <BodyText>{'Name: ' + this.state.name}</BodyText>
                <BodyText>{'Created: ' + this.state.timestampCreated}</BodyText>
                <BodyText>{'Last Opened: ' + this.state.timestampLastOpened}</BodyText>
                <ButtonFilled onClick={() => requestSwitchToWelcomeScreen(ipcRenderer)}>Back</ButtonFilled>
            </Box>
        );
    }
}