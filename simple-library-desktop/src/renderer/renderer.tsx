import './components/basestyle.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import forest from './forest.jpg';
import {ButtonFilled, ButtonGhost, ButtonText, ButtonType, SmallButtonFilled} from "_renderer/components/Buttons";

ReactDOM.render(
    <div className="app theme-light">
        <ButtonFilled type={ButtonType.INFO}>Filled</ButtonFilled>
        <ButtonGhost type={ButtonType.INFO} bg={1}>Ghost</ButtonGhost>
        <ButtonText>Text</ButtonText>
        <SmallButtonFilled type={ButtonType.ERROR}>Filled</SmallButtonFilled>
        <img src={forest} alt="No Image :("/>
    </div>,
    document.getElementById('app'),
);
