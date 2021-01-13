import * as React from "react";
import {Component, ReactElement} from "react";
import {Theme} from "_renderer/RootView";
import {ContainerCenterAlign} from "_renderer/components/layout/Container";
import {H3Text} from "_renderer/components/text/Text";
import {ButtonFilled} from "_renderer/components/buttons/Buttons";
import {requestSwitchToWelcomeScreen} from "_main/Messages";
import {Direction} from "_renderer/components/Common";

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