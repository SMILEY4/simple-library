import * as React from "react";
import {Component, ReactElement} from "react";
import { Theme } from '../application';
import { H3Text } from '../../components/text/Text';
import { ButtonFilled } from '../../components/buttons/Buttons';
import { Dir } from '../../components/common';
import { requestSwitchToWelcomeScreen } from '../../../main/messages';
import { Box } from '../../components/layout/Box';

const {ipcRenderer} = window.require('electron');

interface MainViewProps {
    theme: Theme,
    onChangeTheme: () => void
}

interface MainViewState {
}


export class MainView extends Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {};
    }

    render(): ReactElement {
        return (
            <Box dir={Dir.DOWN}>
                <H3Text>Main Screen</H3Text>
                <ButtonFilled onClick={() => requestSwitchToWelcomeScreen(ipcRenderer)}>Back</ButtonFilled>
            </Box>
        )
    }
}