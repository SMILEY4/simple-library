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

interface WelcomeViewProps {
    theme: Theme,
    onChangeTheme: () => void
}

interface WelcomeViewState {
    recentlyUsed: LibraryEntry[]
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
            ]
        };
    }

    render(): ReactElement {
        const recentlyUsed: LibraryEntry[] = this.state.recentlyUsed
        return (
            <Box expandFully expandChildrenFully className="welcome-view">
                <Grid columns={["1fr", "2fr"]}>
                    <BackgroundImage url={imgWelcome}/>
                    <Grid rows={["1fr", "1fr", "1fr", "auto"]}>

                        <ContainerCenterAlign dir={Direction.DOWN}>
                            <H1Text>Welcome</H1Text>
                            <CaptionText>v0.1.0</CaptionText>
                        </ContainerCenterAlign>

                        <ContainerCenterAlign dir={Direction.DOWN} spacing="0.5em">
                            <ButtonFilled>Create New Library</ButtonFilled>
                            <ButtonFilled>Open Library</ButtonFilled>
                        </ContainerCenterAlign>

                        <ContainerCenterAlign dir={Direction.DOWN} spacing="0.5em">
                            <H3Text>Recently used:</H3Text>
                            <Container dir={Direction.DOWN} alignMain={AlignmentMain.START} alignCross={AlignmentCross.START} spacing="2px">
                                {recentlyUsed.map(libraryEntry => <ButtonText>{libraryEntry.name}</ButtonText>)}
                            </Container>
                        </ContainerCenterAlign>

                        <Container padded dir={Direction.RIGHT} alignMain={AlignmentMain.END} alignCross={AlignmentCross.CENTER}>
                            <ButtonText onClick={this.props.onChangeTheme}>
                                {this.props.theme === Theme.LIGHT ? <FiMoon/> : <FiSun/>} Switch Theme
                            </ButtonText>
                        </Container>

                    </Grid>
                </Grid>
            </Box>
        )
    }
}