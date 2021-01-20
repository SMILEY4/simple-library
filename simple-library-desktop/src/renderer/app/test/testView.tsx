import * as React from 'react';
import { ReactElement } from 'react';
import './testview.css';
import { Box, VBox } from '../../components/layout/Box';
import { AlignCross, AlignMain, Fill } from '../../components/common';
import { Grid } from '../../components/layout/Grid';
import { Image } from '../../components/image/Image';
import imgWelcome from './imgWelcome.jpg';
import { CaptionText, H1Text, H3Text } from '../../components/text/Text';
import { ButtonFilled, ButtonText } from '../../components/buttons/Buttons';


interface TestViewProps {
}


export function TestView(props: React.PropsWithChildren<TestViewProps>): ReactElement {

    return (
        <Box fill={Fill.TRUE}>
            <Grid columns={['1fr', '2fr']} rows={['1fr']} fill={Fill.TRUE}>
                <Image url={imgWelcome} />
                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.CENTER} spacing={'20px'}>
                    <VBox alignCross={AlignCross.CENTER}>
                        <H1Text>Welcome</H1Text>
                        <CaptionText>Simple Library - v0.1.0</CaptionText>
                    </VBox>
                    <VBox alignCross={AlignCross.CENTER} spacing={'5px'}>
                        <ButtonFilled>Create New Library</ButtonFilled>
                        <ButtonFilled>Open Library</ButtonFilled>
                    </VBox>
                    <VBox alignCross={AlignCross.CENTER}>
                        <H3Text>Recently used:</H3Text>
                        <ButtonText>My Library</ButtonText>
                        <ButtonText>Family Photos</ButtonText>
                    </VBox>
                </VBox>
            </Grid>
        </Box>
    );
}
