import * as React from "react";
import {Component, ReactElement} from "react";
import { Theme } from '../application';
import { ContainerCenterAlign } from '../../components/layout/Container';
import { H3Text } from '../../components/text/Text';
import { ButtonFilled } from '../../components/buttons/Buttons';
import { Direction } from '../../components/common';
import { requestSwitchToWelcomeScreen } from '../../../main/messages';

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
            <ContainerCenterAlign dir={Direction.DOWN}>
                <H3Text>Main Screen</H3Text>
                <ButtonFilled onClick={() => requestSwitchToWelcomeScreen(ipcRenderer)}>Back</ButtonFilled>
            </ContainerCenterAlign>
        )
    }
}