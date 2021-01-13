import * as React from "react";
import {Component, ReactElement} from "react";
import {Grid} from "_renderer/components/layout/Grid";
import {BackgroundImage} from "_renderer/components/image/BackgroundImage";
import imgWelcome from "_public/imgWelcome.jpg"
import {Container, ContainerCenterAlign} from "_renderer/components/layout/Container";
import {CaptionText, H1Text, H3Text} from "_renderer/components/text/Text";
import {ButtonFilled, ButtonText} from "_renderer/components/buttons/Buttons";
import {FiMoon, FiSun} from "react-icons/all";
import "./welcome.css"
import {Box} from "_renderer/components/layout/Box";
import {AlignmentCross, AlignmentMain, Direction} from "_renderer/components/Common";
import {Theme} from "_renderer/RootView";
import {CreateLibraryDialog} from "_renderer/welcome/CreateLibraryDialog";
import {requestSwitchToMainScreen} from "_main/Messages";

const {ipcRenderer} = window.require('electron');

interface WelcomeViewProps {
    theme: Theme,
    onChangeTheme: () => void
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
                    name: "Family Photos",
                    url: "path/to/family/photo/library"
                },
                {
                    name: "My Images",
                    url: "path/to/my/library"
                }
            ],
            showCreateLibraryDialog: false
        };
        this.actionCreateNew = this.actionCreateNew.bind(this)
        this.actionCancelCreateNew = this.actionCancelCreateNew.bind(this)
        this.createNewLibrary = this.createNewLibrary.bind(this)
    }


    actionCreateNew(): void {
        this.setState({showCreateLibraryDialog: true})
    }


    createNewLibrary(name: string, targetDir: string): void {
        // TODO
        console.log("CREATE NEW LIBRARY: " + name + " at " + targetDir)
        this.setState({showCreateLibraryDialog: false})
        requestSwitchToMainScreen(ipcRenderer)
    }


    actionCancelCreateNew(): void {
        this.setState({showCreateLibraryDialog: false})
    }


    render(): ReactElement {
        const recentlyUsed: LibraryEntry[] = this.state.recentlyUsed
        return (
            <Box expandFully expandChildrenFully className="welcome-view">
                <Grid columns={["1fr", "1.5fr"]}>
                    <BackgroundImage url={imgWelcome}/>
                    <Grid rows={["1fr", "1fr", "1fr", "auto"]}>

                        <ContainerCenterAlign dir={Direction.DOWN}>
                            <H1Text>Welcome</H1Text>
                            <CaptionText>Simple Library - v0.1.0</CaptionText>
                        </ContainerCenterAlign>

                        <ContainerCenterAlign dir={Direction.DOWN} spacing="0.5em">
                            <ButtonFilled onClick={this.actionCreateNew}>Create New Library</ButtonFilled>
                            <ButtonFilled>Open Library</ButtonFilled>
                        </ContainerCenterAlign>


                        {recentlyUsed.length > 0 && (
                            <ContainerCenterAlign dir={Direction.DOWN} spacing="0.5em">
                                <H3Text>Recently used:</H3Text>
                                <Container dir={Direction.DOWN} alignMain={AlignmentMain.START} alignCross={AlignmentCross.START} spacing="2px">
                                    {recentlyUsed.map(libraryEntry => <ButtonText>{libraryEntry.name}</ButtonText>)}
                                </Container>
                            </ContainerCenterAlign>
                        )}

                        <Container padded dir={Direction.RIGHT} alignMain={AlignmentMain.END} alignCross={AlignmentCross.CENTER}>
                            <ButtonText onClick={this.props.onChangeTheme}>
                                {this.props.theme === Theme.LIGHT ? <FiMoon/> : <FiSun/>} Switch Theme
                            </ButtonText>
                        </Container>

                        <CreateLibraryDialog
                            show={this.state.showCreateLibraryDialog}
                            onClose={this.actionCancelCreateNew}
                            onCreate={this.createNewLibrary}
                        />

                    </Grid>
                </Grid>
            </Box>
        )
    }
}